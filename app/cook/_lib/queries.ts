import {prisma} from "@/lib/prisma";
import type {RecipeSuggestion} from "@/app/cook/_lib/types";

export async function getIngredientNames(): Promise<string[]> {
  const ingredients = await prisma.ingredient.findMany({
    select: {name: true},
    orderBy: {name: "asc"},
  });

  return ingredients.map((ingredient) => ingredient.name);
}

export async function getPantryIngredientNamesForUser(
  userId: number,
): Promise<string[]> {
  const pantryItems = await prisma.pantryItem.findMany({
    where: {userId},
    select: {
      ingredient: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      ingredient: {
        name: "asc",
      },
    },
  });

  const uniqueIngredients = pantryItems.reduce<string[]>((acc, item) => {
    const ingredientName = item.ingredient.name.trim();
    if (!ingredientName) return acc;

    const exists = acc.some(
      (value) =>
        value.toLocaleLowerCase("de-DE") ===
        ingredientName.toLocaleLowerCase("de-DE"),
    );

    if (!exists) {
      acc.push(ingredientName);
    }

    return acc;
  }, []);

  return uniqueIngredients;
}

const normalize = (value: string) => value.trim().toLocaleLowerCase("de-DE");

function toUniqueIngredientNames(names: string[]): Map<string, string> {
  const unique = new Map<string, string>();

  for (const name of names) {
    const trimmed = name.trim();
    if (!trimmed) continue;

    const normalized = normalize(trimmed);
    if (unique.has(normalized)) continue;

    unique.set(normalized, trimmed);
  }

  return unique;
}

export async function findMatchingRecipes(
  selectedIngredients: string[],
): Promise<RecipeSuggestion[]> {
  const selected = new Set(selectedIngredients.map(normalize).filter(Boolean));

  if (selected.size === 0) return [];

  const recipes = await prisma.recipe.findMany({
    where: {isPublic: true},
    select: {
      id: true,
      title: true,
      description: true,
      instructions: true,
      prepTime: true,
      servings: true,
      category: {
        select: {name: true},
      },
      ingredients: {
        select: {
          amount: true,
          unit: true,
          notes: true,
          ingredient: {
            select: {name: true},
          },
        },
      },
    },
  });

  return recipes
    .map((recipe) => {
      const ingredients = recipe.ingredients.map((item) => ({
        name: item.ingredient.name,
        amount: item.amount,
        unit: item.unit,
        notes: item.notes,
      }));

      const uniqueNames = toUniqueIngredientNames(
        ingredients.map((item) => item.name),
      );

      const matchedIngredients: string[] = [];
      const missingIngredients: string[] = [];

      for (const [normalizedName, ingredientName] of uniqueNames) {
        if (selected.has(normalizedName)) {
          matchedIngredients.push(ingredientName);
        } else {
          missingIngredients.push(ingredientName);
        }
      }

      const matchedCount = matchedIngredients.length;
      const missingCount = missingIngredients.length;
      const totalIngredientCount = uniqueNames.size;

      const matchRatio =
        totalIngredientCount > 0 ? matchedCount / totalIngredientCount : 0;

      return {
        id: recipe.id,
        title: recipe.title,
        description: recipe.description,
        instructions: recipe.instructions,
        prepTime: recipe.prepTime,
        servings: recipe.servings,
        category: recipe.category.name,
        ingredients,
        matchedIngredients,
        missingIngredients,
        matchedCount,
        missingCount,
        totalIngredientCount,
        matchRatio,
      };
    })
    .filter((recipe) => recipe.matchedCount > 0)
    .sort(
      (a, b) =>
        b.matchedCount - a.matchedCount ||
        b.matchRatio - a.matchRatio ||
        a.missingCount - b.missingCount ||
        a.title.localeCompare(b.title, "de") ||
        a.id - b.id,
    );
}
