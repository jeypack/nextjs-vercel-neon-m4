"use server";

import {findMatchingRecipes} from "./queries";

export async function searchRecipes(ingredients: string[]) {
  if (!Array.isArray(ingredients)) {
    return [];
  }

  const validIngredients = ingredients
    .filter(
      (ingredient): ingredient is string => typeof ingredient === "string",
    )
    .map((ingredient) => ingredient.trim())
    .filter(Boolean)
    .slice(0, 50);

  return findMatchingRecipes(validIngredients);
}
