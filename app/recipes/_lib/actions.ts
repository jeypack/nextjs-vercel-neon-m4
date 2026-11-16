"use server";

import {revalidatePath} from "next/cache";
import {z} from "zod";
import {getCurrentUser} from "@/lib/auth/session";
import {
  createRecipeWithIngredients,
  deleteRecipeByOwnerOrAdmin,
  updateRecipeWithIngredients,
} from "@/app/recipes/_lib/service";
import {prisma} from "@/lib/prisma";
import type {
  CreateRecipeIngredientInput,
  CreateRecipeServiceInput,
  RecipeCreateFormState,
} from "@/app/recipes/_lib/types";
import {redirect} from "next/navigation";
import {resolveRecipeUnit} from "@/app/_lib/units";

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

const recipeIdSchema = z.object({
  recipeId: z.coerce.number().int().positive("Ungültige Rezept-ID."),
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

function readFormString(formData: FormData, key: string): string {
  const direct = formData.get(key)?.toString().trim();

  if (direct) {
    return direct;
  }

  const idVariant = formData.get(`${key}[id]`)?.toString().trim();

  if (idVariant) {
    return idVariant;
  }

  const dotVariant = formData.get(`${key}.id`)?.toString().trim();

  if (dotVariant) {
    return dotVariant;
  }

  return "";
}

function normalizeDifficulty(value: string): string {
  const normalized = value.trim().toLocaleUpperCase("de-DE");

  const map: Record<string, "EASY" | "MEDIUM" | "HARD"> = {
    EASY: "EASY",
    MEDIUM: "MEDIUM",
    HARD: "HARD",
    EINFACH: "EASY",
    MITTEL: "MEDIUM",
    ANSPRUCHSVOLL: "HARD",
    "1": "EASY",
    "2": "MEDIUM",
    "3": "HARD",
  };

  return map[normalized] ?? value;
}

function buildIngredientInputs(
  formData: FormData,
  availableUnitSymbols: readonly string[],
): {
  ingredients: CreateRecipeIngredientInput[];
  errors: string[];
  rowErrors: {
    name?: string;
    amount?: string;
    unit?: string;
    notes?: string;
  }[];
} {
  const names = formData
    .getAll("ingredientName")
    .map((value) => value.toString());
  const amounts = formData
    .getAll("ingredientAmount")
    .map((value) => value.toString());
  const units = formData
    .getAll("ingredientUnit")
    .map((value) => value.toString());
  const notes = formData
    .getAll("ingredientNotes")
    .map((value) => value.toString());

  const rowCount = Math.max(
    names.length,
    amounts.length,
    units.length,
    notes.length,
  );
  const ingredients: CreateRecipeIngredientInput[] = [];
  const ingredientRowIndices: number[] = [];
  const errors: string[] = [];
  const rowErrors: {
    name?: string;
    amount?: string;
    unit?: string;
    notes?: string;
  }[] = [];

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
        rowErrors[index] = {
          ...rowErrors[index],
          name: "Bitte gib eine Zutat an.",
        };
      }
      continue;
    }

    if (normalizedName.length > 100) {
      rowErrors[index] = {
        ...rowErrors[index],
        name: "Die Zutat ist zu lang.",
      };
      continue;
    }

    let amount: number | null = null;

    if (row.amount.trim()) {
      const parsedAmount = Number(row.amount);

      if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
        rowErrors[index] = {
          ...rowErrors[index],
          amount: "Die Menge muss größer als 0 sein.",
        };
        continue;
      }

      amount = parsedAmount;
    }

    if (!normalizedUnit) {
      rowErrors[index] = {
        ...rowErrors[index],
        unit: "Bitte wähle eine Einheit aus.",
      };
      continue;
    }

    if (normalizedUnit.length > 30) {
      rowErrors[index] = {
        ...rowErrors[index],
        unit: "Die Einheit ist zu lang.",
      };
      continue;
    }

    const canonicalUnitSymbol = resolveRecipeUnit(
      normalizedUnit,
      availableUnitSymbols,
    );

    if (!canonicalUnitSymbol) {
      rowErrors[index] = {
        ...rowErrors[index],
        unit: "Bitte wähle eine gültige Einheit aus der Liste aus.",
      };
      continue;
    }

    if (normalizedNotes.length > 120) {
      rowErrors[index] = {
        ...rowErrors[index],
        notes: "Die Notiz ist zu lang.",
      };
      continue;
    }

    ingredients.push({
      name: normalizedName,
      amount,
      unit: canonicalUnitSymbol,
      notes: normalizedNotes || null,
    });

    ingredientRowIndices.push(index);
  }

  const seen = new Set<string>();

  for (const [ingredientIndex, ingredient] of ingredients.entries()) {
    const rowIndex = ingredientRowIndices[ingredientIndex];
    const key = ingredient.name.toLocaleLowerCase("de-DE");

    if (seen.has(key)) {
      rowErrors[rowIndex] = {
        ...rowErrors[rowIndex],
        name: `Die Zutat "${ingredient.name}" wurde mehrfach eingetragen.`,
      };
    }

    seen.add(key);
  }

  if (ingredients.length === 0) {
    errors.push("Bitte füge mindestens eine Zutat hinzu.");
  }

  return {ingredients, errors, rowErrors};
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
    categoryId: readFormString(formData, "categoryId"),
    prepTime: formData.get("prepTime")?.toString() ?? "",
    servings: formData.get("servings")?.toString() ?? "",
    difficulty: normalizeDifficulty(readFormString(formData, "difficulty")),
    isPublic: formData.get("isPublic") === "on",
  };

  const parsedRecipe = recipeBaseSchema.safeParse(rawData);

  const availableUnits = await prisma.unit.findMany({
    select: {symbol: true},
  });

  const availableUnitSymbols = availableUnits.map((unit) => unit.symbol);

  const ingredientInput = buildIngredientInputs(formData, availableUnitSymbols);

  const hasIngredientRowErrors = ingredientInput.rowErrors.some(
    (rowError) => rowError && Object.keys(rowError).length > 0,
  );

  if (
    !parsedRecipe.success ||
    ingredientInput.errors.length > 0 ||
    hasIngredientRowErrors
  ) {
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

    if (ingredientInput.errors.length > 0 || hasIngredientRowErrors) {
      errors.ingredients =
        ingredientInput.errors.length > 0
          ? ingredientInput.errors
          : ["Bitte korrigiere die markierten Zutatenfelder."];
    }

    return {
      success: false,
      ingredientRowErrors: ingredientInput.rowErrors,
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

export async function updateRecipe(
  _prevState: RecipeCreateFormState,
  formData: FormData,
): Promise<RecipeCreateFormState> {
  const user = await getCurrentUser();

  if (!user) {
    return {
      success: false,
      message: "Bitte melde dich zuerst an, um Rezepte zu bearbeiten.",
    };
  }

  const parsedRecipeId = recipeIdSchema.safeParse({
    recipeId: formData.get("recipeId")?.toString() ?? "",
  });

  if (!parsedRecipeId.success) {
    return {
      success: false,
      message: "Ungültiges Rezept.",
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
    categoryId: readFormString(formData, "categoryId"),
    prepTime: formData.get("prepTime")?.toString() ?? "",
    servings: formData.get("servings")?.toString() ?? "",
    difficulty: normalizeDifficulty(readFormString(formData, "difficulty")),
    isPublic: formData.get("isPublic") === "on",
  };

  const parsedRecipe = recipeBaseSchema.safeParse(rawData);

  const availableUnits = await prisma.unit.findMany({
    select: {symbol: true},
  });

  const availableUnitSymbols = availableUnits.map((unit) => unit.symbol);

  const ingredientInput = buildIngredientInputs(formData, availableUnitSymbols);

  const hasIngredientRowErrors = ingredientInput.rowErrors.some(
    (rowError) => rowError && Object.keys(rowError).length > 0,
  );

  if (
    !parsedRecipe.success ||
    ingredientInput.errors.length > 0 ||
    hasIngredientRowErrors
  ) {
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

    if (ingredientInput.errors.length > 0 || hasIngredientRowErrors) {
      errors.ingredients =
        ingredientInput.errors.length > 0
          ? ingredientInput.errors
          : ["Bitte korrigiere die markierten Zutatenfelder."];
    }

    return {
      success: false,
      ingredientRowErrors: ingredientInput.rowErrors,
      errors,
      message: "Bitte prüfe deine Eingaben.",
    };
  }

  const result = await updateRecipeWithIngredients({
    recipeId: parsedRecipeId.data.recipeId,
    actorId: user.id,
    isAdmin: user.role === "ADMIN",
    categoryId: parsedRecipe.data.categoryId,
    title: parsedRecipe.data.title,
    description: parsedRecipe.data.description ?? null,
    instructions: parsedRecipe.data.instructions,
    prepTime: parsedRecipe.data.prepTime,
    servings: parsedRecipe.data.servings,
    difficulty: parsedRecipe.data.difficulty,
    isPublic: parsedRecipe.data.isPublic,
    ingredients: ingredientInput.ingredients,
  });

  if (!result.success) {
    return result;
  }

  revalidatePath("/recipes");
  revalidatePath(`/recipes/${parsedRecipeId.data.recipeId}`);
  revalidatePath(`/recipes/${parsedRecipeId.data.recipeId}/edit`);

  return result;
}

export async function deleteRecipe(
  _prevState: RecipeCreateFormState,
  formData: FormData,
): Promise<RecipeCreateFormState> {
  const user = await getCurrentUser();

  if (!user) {
    return {
      success: false,
      message: "Bitte melde dich zuerst an, um Rezepte zu löschen.",
    };
  }

  const parsedRecipeId = recipeIdSchema.safeParse({
    recipeId: formData.get("recipeId")?.toString() ?? "",
  });

  if (!parsedRecipeId.success) {
    return {
      success: false,
      message: "Ungültiges Rezept.",
    };
  }

  const result = await deleteRecipeByOwnerOrAdmin({
    recipeId: parsedRecipeId.data.recipeId,
    actorId: user.id,
    isAdmin: user.role === "ADMIN",
  });

  if (!result.success) {
    return result;
  }

  revalidatePath("/recipes");

  // Beendet die Ausführung der Server Action durch eine spezielle Next.js-Exception.
  redirect(result.redirectTo ?? "/recipes");
}
