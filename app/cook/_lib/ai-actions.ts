"use server";

import {GoogleGenAI} from "@google/genai";
import * as z from "zod";

export async function testGemini({prompt}: {prompt: string}) {
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
            ingredients: {
              type: "array",
              items: {type: "string"},
            },
            prep_time_minutes: {type: "integer"},
          },
          required: ["recipe_name", "ingredients", "prep_time_minutes"],
        },
      },
    },
    required: ["recipes"],
  };

  const recipeSchema = z.fromJSONSchema(recipeJsonSchema);

  const interaction = await ai.interactions.create({
    //model: "gemini-3.5-flash-lite",
    model: "gemini-3.1-flash-lite",
    input: prompt,
    response_format: {
      type: "text",
      mime_type: "application/json",
      schema: recipeJsonSchema,
    },
    generation_config: {
      thinking_level: "low",
      //thinking_summaries: "auto",
      //max_output_tokens: 100,
    },
  });

  const outputText = interaction.output_text ?? "{}";
  const recipe = recipeSchema.parse(JSON.parse(outputText));

  return {
    answer: interaction.output_text ?? "",
    recipe,
    duration: `${((Date.now() - start) / 1000).toFixed(1)} Sekunden`,
  };
}
