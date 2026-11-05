"use server";

import {revalidatePath} from "next/cache";
import {z} from "zod";
import {Prisma} from "@/lib/generated/prisma/client";
import {prisma} from "@/lib/prisma";
import {getCurrentUser} from "@/lib/auth/session";
import type {MealPlanFormState} from "@/app/meal-plan/_lib/types";
import { getOccupiedMealPlanSlots } from "@/app/meal-plan/_lib/queries";

const mealPlanCreateSchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Bitte gib ein gültiges Datum an."),
  mealType: z.enum(["BREAKFAST", "LUNCH", "DINNER"], {
    message: "Bitte wähle einen gültigen Meal-Slot.",
  }),
  recipeId: z.coerce.number().int().positive("Bitte wähle ein Rezept aus."),
});

const mealPlanDeleteSchema = z.object({
  id: z.coerce.number().int().positive("Ungültiger Plan-Eintrag."),
});

function parseDateInputToUtcDate(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function buildValidationErrors(issues: z.ZodIssue[]): MealPlanFormState {
  const errors: NonNullable<MealPlanFormState["errors"]> = {};

  for (const issue of issues) {
    const path = issue.path[0];

    if (typeof path !== "string") {
      continue;
    }

    const key = path as keyof NonNullable<MealPlanFormState["errors"]>;
    errors[key] ??= [];
    errors[key]!.push(issue.message);
  }

  return {
    success: false,
    errors,
    message: "Bitte prüfe deine Eingaben.",
  };
}

export async function createMealPlanEntry(
  _prevState: MealPlanFormState,
  formData: FormData,
): Promise<MealPlanFormState> {
  const user = await getCurrentUser();

  if (!user) {
    return {
      success: false,
      message: "Bitte melde dich zuerst an, um den Plan zu bearbeiten.",
    };
  }

  const parsed = mealPlanCreateSchema.safeParse({
    date: formData.get("date")?.toString() ?? "",
    mealType: formData.get("mealType")?.toString() ?? "",
    recipeId: formData.get("recipeId")?.toString() ?? "",
  });

  if (!parsed.success) {
    return buildValidationErrors(parsed.error.issues);
  }

  const slotDate = parseDateInputToUtcDate(parsed.data.date);

  if (Number.isNaN(slotDate.getTime())) {
    return {
      success: false,
      errors: {
        date: ["Bitte gib ein gültiges Datum an."],
      },
      message: "Bitte prüfe deine Eingaben.",
    };
  }

  const recipe = await prisma.recipe.findFirst({
    where:
      user.role === "ADMIN"
        ? {id: parsed.data.recipeId}
        : {
            id: parsed.data.recipeId,
            OR: [{isPublic: true}, {userId: user.id}],
          },
    select: {
      id: true,
    },
  });

  if (!recipe) {
    return {
      success: false,
      errors: {
        recipeId: ["Dieses Rezept darfst du nicht einplanen."],
      },
      message: "Bitte wähle ein gültiges Rezept.",
    };
  }

  try {
    await prisma.mealPlan.create({
      data: {
        userId: user.id,
        date: slotDate,
        mealType: parsed.data.mealType,
        recipeId: recipe.id,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        message:
          "Dieser Slot ist bereits belegt. Bitte entferne den vorhandenen Eintrag zuerst.",
      };
    }

    throw error;
  }

  revalidatePath("/meal-plan");
  revalidatePath("/shopping-list");

  return {
    success: true,
    message: "Mahlzeit wurde eingeplant.",
  };
}

export async function deleteMealPlanEntry(
  _prevState: MealPlanFormState,
  formData: FormData,
): Promise<MealPlanFormState> {
  const user = await getCurrentUser();

  if (!user) {
    return {
      success: false,
      message: "Bitte melde dich zuerst an, um den Plan zu bearbeiten.",
    };
  }

  const parsed = mealPlanDeleteSchema.safeParse({
    id: formData.get("id")?.toString() ?? "",
  });

  if (!parsed.success) {
    return buildValidationErrors(parsed.error.issues);
  }

  const deleted = await prisma.mealPlan.deleteMany({
    where: {
      id: parsed.data.id,
      userId: user.id,
    },
  });

  if (deleted.count === 0) {
    return {
      success: false,
      message: "Eintrag nicht gefunden oder keine Berechtigung.",
    };
  }

  revalidatePath("/meal-plan");
  revalidatePath("/shopping-list");

  return {
    success: true,
    message: "Eintrag wurde entfernt.",
  };
}

export async function fetchOccupiedMealPlanSlots(
  startDate: string,
  endDate: string,
) {
  return getOccupiedMealPlanSlots(startDate, endDate);
}