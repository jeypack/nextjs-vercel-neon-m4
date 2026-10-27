"use server";

import {revalidatePath} from "next/cache";
import {z} from "zod";
import {
  createPantryItemWithIngredient,
  deletePantryItemByOwner,
  updatePantryItemByOwner,
} from "@/app/pantry/_lib/service";

import {getCurrentUser} from "@/lib/auth/session";
import type {
  CreatePantryItemServiceInput,
  DeletePantryItemServiceInput,
  PantryFormState,
  PantryValidationIssue,
  UpdatePantryItemServiceInput,
} from "@/app/pantry/_lib/types";

const pantryItemSchema = z.object({
  ingredient: z
    .string()
    .trim()
    .min(2, "Zutat muss mindestens 2 Zeichen lang sein."),
  quantity: z
    .string()
    .optional()
    .transform((value) =>
      value === "" || value === undefined ? null : Number(value),
    ),
  unit: z.string().optional(),
  packageSize: z
    .string()
    .optional()
    .transform((value) =>
      value === "" || value === undefined ? null : Number(value),
    ),
  packageUnit: z.string().optional(),
  expiresAt: z
    .string()
    .optional()
    .transform((value) =>
      value === "" || value === undefined ? null : new Date(value),
    ),
  notes: z.string().optional(),
});

const pantryItemIdSchema = z.object({
  id: z.coerce.number().int().positive("Ungültige Pantry-Item-ID."),
});

const pantryItemUpdateSchema = z.object({
  id: z.coerce.number().int().positive("Ungültige Pantry-Item-ID."),
  quantity: z
    .string()
    .optional()
    .transform((value) =>
      value === "" || value === undefined ? null : Number(value),
    ),
  unit: z.string().optional(),
  packageSize: z
    .string()
    .optional()
    .transform((value) =>
      value === "" || value === undefined ? null : Number(value),
    ),
  packageUnit: z.string().optional(),
  expiresAt: z
    .string()
    .optional()
    .transform((value) =>
      value === "" || value === undefined ? null : new Date(value),
    ),
  notes: z.string().optional(),
});

function buildValidationErrors(
  issues: PantryValidationIssue[],
): PantryFormState {
  const errors: NonNullable<PantryFormState["errors"]> = {};

  for (const issue of issues) {
    const path = issue.path[0];

    if (typeof path !== "string") {
      continue;
    }

    const key = path as keyof NonNullable<PantryFormState["errors"]>;
    errors[key] ??= [];
    errors[key]!.push(issue.message);
  }

  return {
    success: false,
    errors,
    message: "Bitte prüfe deine Eingaben.",
  };
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
    packageSize: formData.get("packageSize")?.toString() ?? "",
    packageUnit: formData.get("packageUnit")?.toString() ?? "",
    expiresAt: formData.get("expiresAt")?.toString() ?? "",
    notes: formData.get("notes")?.toString() ?? "",
  };

  const parsed = pantryItemSchema.safeParse(rawData);

  if (!parsed.success) {
    const errors: NonNullable<PantryFormState["errors"]> = {};

    for (const issue of parsed.error.issues) {
      if (issue.path[0] && typeof issue.path[0] === "string") {
        const key = issue.path[0] as keyof NonNullable<
          PantryFormState["errors"]
        >;
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

  const {
    ingredient,
    quantity,
    unit,
    packageSize,
    packageUnit,
    expiresAt,
    notes,
  } = parsed.data;
  const serviceInput: CreatePantryItemServiceInput = {
    userId: user.id,
    ingredient,
    quantity,
    unit,
    packageSize,
    packageUnit,
    expiresAt,
    notes,
  };

  const result = await createPantryItemWithIngredient(serviceInput);

  if (!result.success) {
    return result;
  }

  revalidatePath("/pantry");

  return result;
}

export async function updatePantryItem(
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
    id: formData.get("id")?.toString() ?? "",
    quantity: formData.get("quantity")?.toString() ?? "",
    unit: formData.get("unit")?.toString() ?? "",
    packageSize: formData.get("packageSize")?.toString() ?? "",
    packageUnit: formData.get("packageUnit")?.toString() ?? "",
    expiresAt: formData.get("expiresAt")?.toString() ?? "",
    notes: formData.get("notes")?.toString() ?? "",
  };

  const parsed = pantryItemUpdateSchema.safeParse(rawData);

  if (!parsed.success) {
    return buildValidationErrors(parsed.error.issues);
  }

  const {id, quantity, unit, packageSize, packageUnit, expiresAt, notes} =
    parsed.data;
  const serviceInput: UpdatePantryItemServiceInput = {
    userId: user.id,
    id,
    quantity,
    unit,
    packageSize,
    packageUnit,
    expiresAt,
    notes,
  };
  const result = await updatePantryItemByOwner(serviceInput);

  if (!result.success) {
    return result;
  }

  revalidatePath("/pantry");

  return result;
}

export async function deletePantryItem(
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

  const parsed = pantryItemIdSchema.safeParse({
    id: formData.get("id")?.toString() ?? "",
  });

  if (!parsed.success) {
    return buildValidationErrors(parsed.error.issues);
  }

  const serviceInput: DeletePantryItemServiceInput = {
    userId: user.id,
    id: parsed.data.id,
  };
  const result = await deletePantryItemByOwner(serviceInput);

  if (!result.success) {
    return result;
  }

  revalidatePath("/pantry");

  return result;
}
