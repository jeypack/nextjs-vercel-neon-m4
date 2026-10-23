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

import {GoogleGenAI} from "@google/genai";

const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

const response = await ai.models.generateContent({
  model: "gemini-3.8-flash",
  contents: "Explain how AI works in a few words",
});

console.log(response.text);
