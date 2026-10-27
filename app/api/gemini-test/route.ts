import {GoogleGenAI} from "@google/genai";
import * as z from "zod";
import {NextResponse} from "next/server";

export async function GET() {
  console.log("1. Route gestartet");

  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    console.log("2. Gemini wird aufgerufen...");

    /* const recipeJsonSchema: z.JSONType = {
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

    const stream = await ai.interactions.create({
      model: "gemini-3.8-flash",
      input: "Nenne drei einfache Gerichte mit Tomaten.",
      response_format: {
        type: "text",
        mime_type: "application/json",
        schema: recipeJsonSchema,
      },
      generation_config: {
        thinking_level: "low",
        thinking_summaries: "auto",
      },
      //stream: true,
    }); */
    const response = await ai.interactions.create({
      model: "gemini-3.1-flash-lite",
      input: "Wie heißt die Hauptstadt von Frankreich?",
    });

    /* console.log("3. Stream gestartet...");
    for await (const event of stream) {
      if (event.event_type === "step.start") {
        console.log(`\n--- Step: ${event.step.type} ---`);
      } else if (event.event_type === "step.delta") {
        if (event.delta.type === "thought_summary") {
          if (event.delta.content?.type === "text") {
            process.stdout.write(event.delta.content.text);
          }
        } else if (event.delta.type === "text") {
          process.stdout.write(event.delta.text);
        }
      }
    }
    console.log("4. Stream beendet."); */
    const answer = response.output_text ?? "";
    //const recipe = recipeSchema.parse(JSON.parse(stream.output_text ?? "{}"));
    return NextResponse.json({text: "Stream erfolgreich beendet.", answer});
  } catch (error) {
    console.error("Gemini API error:", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      {status: 500},
    );
  }
}
