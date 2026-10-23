import {prisma} from "@/lib/prisma";
import type {RecipeSuggestion} from "@/app/cook/_lib/types";

export async function getIngredientNames(): Promise<string[]> {
  const ingredients = await prisma.ingredient.findMany({
    select: {name: true},
    orderBy: {name: "asc"},
  });

  return ingredients.map((ingredient) => ingredient.name);
}

export async function findMatchingRecipes(
  selectedIngredients: string[],
): Promise<RecipeSuggestion[]> {
  const normalize = (value: string) => value.trim().toLocaleLowerCase("de-DE");

  const selected = new Set(selectedIngredients.map(normalize).filter(Boolean));

  if (selected.size === 0) {
    return [];
  }

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

      const matchedIngredients = ingredients
        .filter((item) => selected.has(normalize(item.name)))
        .map((item) => item.name);

      const missingIngredients = ingredients
        .filter((item) => !selected.has(normalize(item.name)))
        .map((item) => item.name);

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
      };
    })
    .filter((recipe) => recipe.matchedIngredients.length > 0)
    .sort(
      (a, b) =>
        b.matchedIngredients.length - a.matchedIngredients.length ||
        a.missingIngredients.length - b.missingIngredients.length ||
        a.title.localeCompare(b.title, "de"),
    );
}
