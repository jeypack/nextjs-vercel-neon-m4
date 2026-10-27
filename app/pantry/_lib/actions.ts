"use server";

import {revalidatePath} from "next/cache";
import {z} from "zod";

import {getCurrentUser} from "@/lib/auth/session";
import {prisma} from "@/lib/prisma";
import {PANTRY_UNITS, type PantryFormState} from "@/app/pantry/_lib/types";

const pantryItemSchema = z.object({
  ingredient: z
    .string()
    .trim()
    .min(2, "Zutat muss mindestens 2 Zeichen lang sein."),
  quantity: z
    .string()
    .optional()
    .transform((value) => (value === "" || value === undefined ? null : Number(value))),
  unit: z.string().optional(),
  expiresAt: z
    .string()
    .optional()
    .transform((value) => (value === "" || value === undefined ? null : new Date(value))),
  notes: z.string().optional(),
});

function normalizeIngredientName(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function normalizeUnit(value: string | undefined) {
  const normalized = value?.trim() ?? "";
  return normalized ? normalized : null;
}

export async function createPantryItem(
  _prevState: PantryFormState,
  formData: FormData,
): Promise<PantryFormState> {
  const user = await getCurrentUser();

  if (!user) {
    return {
      success: false,
      message: "Bitte melde dich zuerst an, um deinen Vorrat zu verwalten.",
    };
  }

  const rawData = {
    ingredient: formData.get("ingredient")?.toString() ?? "",
    quantity: formData.get("quantity")?.toString() ?? "",
    unit: formData.get("unit")?.toString() ?? "",
    expiresAt: formData.get("expiresAt")?.toString() ?? "",
    notes: formData.get("notes")?.toString() ?? "",
  };

  const parsed = pantryItemSchema.safeParse(rawData);

  if (!parsed.success) {
    const errors: NonNullable<PantryFormState["errors"]> = {};

    for (const issue of parsed.error.issues) {
      if (issue.path[0] && typeof issue.path[0] === "string") {
        const key = issue.path[0] as keyof NonNullable<PantryFormState["errors"]>;
        errors[key] ??= [];
        errors[key]!.push(issue.message);
      }
    }

    return {
      success: false,
      errors,
      message: "Bitte prüfe deine Eingaben.",
    };
  }

  const {ingredient, quantity, unit, expiresAt, notes} = parsed.data;
  const normalizedUnit = normalizeUnit(unit);

  if (quantity !== null && (!Number.isFinite(quantity) || quantity <= 0)) {
    return {
      success: false,
      errors: {
        quantity: ["Die Menge muss größer als 0 sein."],
      },
      message: "Bitte prüfe deine Eingaben.",
    };
  }

  if (expiresAt && Number.isNaN(expiresAt.getTime())) {
    return {
      success: false,
      errors: {
        expiresAt: ["Bitte gib ein gültiges Ablaufdatum ein."],
      },
      message: "Bitte prüfe deine Eingaben.",
    };
  }

  if (normalizedUnit && !PANTRY_UNITS.some((unitOption) => unitOption === normalizedUnit)) {
    return {
      success: false,
      errors: {
        unit: ["Bitte wähle eine gültige Einheit aus der Liste."],
      },
      message: "Bitte prüfe deine Eingaben.",
    };
  }

  const normalizedIngredientName = normalizeIngredientName(ingredient);

  if (!normalizedIngredientName) {
    return {
      success: false,
      errors: {
        ingredient: ["Bitte gib eine gültige Zutat ein."],
      },
      message: "Bitte prüfe deine Eingaben.",
    };
  }

  const existingIngredient = await prisma.ingredient.findFirst({
    where: {
      name: {
        equals: normalizedIngredientName,
        mode: "insensitive",
      },
    },
  });

  const ingredientRecord = existingIngredient ?? (await prisma.ingredient.create({
    data: {
      name: normalizedIngredientName,
      category: {
        connectOrCreate: {
          where: {slug: "vegetables"},
          create: {
            name: "Vegetables",
            slug: "vegetables",
          },
        },
      },
    },
  }));

  await prisma.pantryItem.create({
    data: {
      userId: user.id,
      ingredientId: ingredientRecord.id,
      quantity,
      unit: normalizedUnit,
      expiresAt,
      notes: notes && notes.trim() ? notes.trim() : null,
    },
  });

  revalidatePath("/pantry");

  return {
    success: true,
    message: "Dein Vorratseintrag wurde gespeichert.",
  };
}
