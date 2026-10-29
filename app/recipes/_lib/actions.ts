"use server";

import {revalidatePath} from "next/cache";
import {z} from "zod";
import {getCurrentUser} from "@/lib/auth/session";
import {createRecipeWithIngredients} from "@/app/recipes/_lib/service";
import type {
  CreateRecipeIngredientInput,
  CreateRecipeServiceInput,
  RecipeCreateFormState,
} from "@/app/recipes/_lib/types";

const recipeBaseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Der Rezepttitel muss mindestens 3 Zeichen lang sein.")
    .max(120, "Der Rezepttitel darf maximal 120 Zeichen lang sein."),
  description: z
    .string()
    .trim()
    .max(500, "Die Beschreibung darf maximal 500 Zeichen lang sein.")
    .optional(),
  instructions: z
    .string()
    .trim()
    .min(10, "Bitte gib eine kurze Zubereitungsanleitung an.")
    .max(5000, "Die Anleitung ist zu lang."),
  categoryId: z.coerce
    .number()
    .int()
    .positive("Bitte wähle eine Kategorie aus."),
  prepTime: z.coerce
    .number()
    .int()
    .positive("Die Vorbereitungszeit muss größer als 0 sein.")
    .max(1440, "Die Vorbereitungszeit ist zu hoch."),
  servings: z.coerce
    .number()
    .int()
    .positive("Die Portionen müssen größer als 0 sein.")
    .max(50, "Die Portionsanzahl ist zu hoch."),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"], {
    message: "Bitte wähle einen gültigen Schwierigkeitsgrad.",
  }),
  isPublic: z.boolean(),
});

function normalizeOptionalText(value: string | undefined, maxLength: number) {
  const normalized = value?.trim() ?? "";

  if (!normalized) {
    return {value: null as string | null};
  }

  if (normalized.length > maxLength) {
    return {error: `Darf maximal ${maxLength} Zeichen lang sein.`};
  }

  return {value: normalized};
}

function buildIngredientInputs(formData: FormData): {
  ingredients: CreateRecipeIngredientInput[];
  errors: string[];
} {
  const names = formData.getAll("ingredientName").map((value) => value.toString());
  const amounts = formData
    .getAll("ingredientAmount")
    .map((value) => value.toString());
  const units = formData.getAll("ingredientUnit").map((value) => value.toString());
  const notes = formData.getAll("ingredientNotes").map((value) => value.toString());

  const rowCount = Math.max(names.length, amounts.length, units.length, notes.length);
  const ingredients: CreateRecipeIngredientInput[] = [];
  const errors: string[] = [];

  for (let index = 0; index < rowCount; index++) {
    const row = {
      name: names[index] ?? "",
      amount: amounts[index] ?? "",
      unit: units[index] ?? "",
      notes: notes[index] ?? "",
    };

    const normalizedName = row.name.trim().replace(/\s+/g, " ");
    const normalizedUnit = row.unit.trim();
    const normalizedNotes = row.notes.trim();
    const hasOtherValues =
      row.amount.trim().length > 0 ||
      normalizedUnit.length > 0 ||
      normalizedNotes.length > 0;

    if (!normalizedName) {
      if (hasOtherValues) {
        errors.push(`Bitte gib in Zeile ${index + 1} eine Zutat an.`);
      }
      continue;
    }

    if (normalizedName.length > 100) {
      errors.push(`Die Zutat in Zeile ${index + 1} ist zu lang.`);
      continue;
    }

    let amount: number | null = null;

    if (row.amount.trim()) {
      const parsedAmount = Number(row.amount);

      if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
        errors.push(`Die Menge in Zeile ${index + 1} muss größer als 0 sein.`);
        continue;
      }

      amount = parsedAmount;
    }

    if (normalizedUnit.length > 30) {
      errors.push(`Die Einheit in Zeile ${index + 1} ist zu lang.`);
      continue;
    }

    if (normalizedNotes.length > 120) {
      errors.push(`Die Notiz in Zeile ${index + 1} ist zu lang.`);
      continue;
    }

    ingredients.push({
      name: normalizedName,
      amount,
      unit: normalizedUnit || null,
      notes: normalizedNotes || null,
    });
  }

  const seen = new Set<string>();

  for (const ingredient of ingredients) {
    const key = ingredient.name.toLocaleLowerCase("de-DE");

    if (seen.has(key)) {
      errors.push(`Die Zutat "${ingredient.name}" wurde mehrfach eingetragen.`);
    }

    seen.add(key);
  }

  if (ingredients.length === 0) {
    errors.push("Bitte füge mindestens eine Zutat hinzu.");
  }

  return {ingredients, errors};
}

export async function createRecipe(
  _prevState: RecipeCreateFormState,
  formData: FormData,
): Promise<RecipeCreateFormState> {
  const user = await getCurrentUser();

  if (!user) {
    return {
      success: false,
      message: "Bitte melde dich zuerst an, um Rezepte zu erstellen.",
    };
  }

  const descriptionValidation = normalizeOptionalText(
    formData.get("description")?.toString(),
    500,
  );

  if (descriptionValidation.error) {
    return {
      success: false,
      errors: {
        description: [descriptionValidation.error],
      },
      message: "Bitte prüfe deine Eingaben.",
    };
  }

  const rawData = {
    title: formData.get("title")?.toString() ?? "",
    description: descriptionValidation.value ?? undefined,
    instructions: formData.get("instructions")?.toString() ?? "",
    categoryId: formData.get("categoryId")?.toString() ?? "",
    prepTime: formData.get("prepTime")?.toString() ?? "",
    servings: formData.get("servings")?.toString() ?? "",
    difficulty: formData.get("difficulty")?.toString() ?? "",
    isPublic: formData.get("isPublic") === "on",
  };

  const parsedRecipe = recipeBaseSchema.safeParse(rawData);
  const ingredientInput = buildIngredientInputs(formData);

  if (!parsedRecipe.success || ingredientInput.errors.length > 0) {
    const errors: NonNullable<RecipeCreateFormState["errors"]> = {};

    if (!parsedRecipe.success) {
      for (const issue of parsedRecipe.error.issues) {
        const path = issue.path[0];

        if (typeof path !== "string") {
          continue;
        }

        const key = path as keyof NonNullable<RecipeCreateFormState["errors"]>;
        errors[key] ??= [];
        errors[key]!.push(issue.message);
      }
    }

    if (ingredientInput.errors.length > 0) {
      errors.ingredients = ingredientInput.errors;
    }

    return {
      success: false,
      errors,
      message: "Bitte prüfe deine Eingaben.",
    };
  }

  const serviceInput: CreateRecipeServiceInput = {
    userId: user.id,
    categoryId: parsedRecipe.data.categoryId,
    title: parsedRecipe.data.title,
    description: parsedRecipe.data.description ?? null,
    instructions: parsedRecipe.data.instructions,
    prepTime: parsedRecipe.data.prepTime,
    servings: parsedRecipe.data.servings,
    difficulty: parsedRecipe.data.difficulty,
    isPublic: parsedRecipe.data.isPublic,
    ingredients: ingredientInput.ingredients,
  };

  const result = await createRecipeWithIngredients(serviceInput);

  if (!result.success) {
    return result;
  }

  revalidatePath("/recipes");

  return result;
}
