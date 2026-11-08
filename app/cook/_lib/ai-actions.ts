"use server";

import {GoogleGenAI} from "@google/genai";
import * as z from "zod";

export async function generateGeminiRecipes({prompt}: {prompt: string}) {
  const start = Date.now();

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const recipeJsonSchema: z.JSONType = {
    type: "object",
    properties: {
      recipes: {
        type: "array",
        items: {
          type: "object",
          properties: {
            recipe_name: {type: "string"},
            description: {type: "string"},
            prep_time_minutes: {type: "integer"},
            servings: {type: "integer"},
            instructions: {
              type: "array",
              items: {type: "string"},
            },
            ingredients: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: {type: "string"},
                  amount: {
                    type: ["number", "null"],
                  },
                  unit: {
                    type: ["string", "null"],
                  },
                  notes: {type: "string"},
                },
                required: ["name", "amount", "unit", "notes"],
              },
            },
          },
          required: [
            "recipe_name",
            "description",
            "prep_time_minutes",
            "servings",
            "instructions",
            "ingredients",
          ],
        },
      },
    },
    required: ["recipes"],
  };

  const recipeSchema = z.fromJSONSchema(recipeJsonSchema);

  const finalPrompt = "Erstelle 4 vollständige Rezeptvorschläge aus den angegebenen Zutaten.\n\n" +
    "Zutaten: " + prompt + "\n\n" +
    "Beachte:\n" +
    "- Verwende bevorzugt die vorhandenen Zutaten.\n" +
    "- Ergänze nur sinnvolle weitere Zutaten.\n" +
    "- Gib Mengen als Zahlen an.\n" +
    "- Verwende passende Einheiten (g, ml, Stück, EL, TL usw.).\n" +
    "- Bei Zutaten ohne Mengenangabe verwende amount: null und unit: null.\n" +
    "- Ergänze Zubereitungsschritte.\n" +
    "- Gib die Anzahl der Portionen an.\n" +
    "- Die Zubereitungszeit wird in Minuten angegeben.\n" +
    "- Erfinde keine Zutaten, die nicht zum Rezept passen."

  /* const finalPrompt = `Bitte formatiere die Antwort als JSON nach folgendem Schema: ${JSON.stringify(
    recipeJsonSchema,
  )}\n\n${prompt}`; */

  const interaction = await ai.interactions.create({
    model: "gemini-3.1-flash-lite",
    input: finalPrompt,
    response_format: {
      type: "text",
      mime_type: "application/json",
      schema: recipeJsonSchema,
    },
    generation_config: {
      thinking_level: "low",
    },
  });

  const outputText = interaction.output_text ?? "{}";
  const recipe = recipeSchema.parse(JSON.parse(outputText));

  return {
    answer: outputText,
    recipe,
    duration: `${((Date.now() - start) / 1000).toFixed(1)} Sekunden`,
  };
}
