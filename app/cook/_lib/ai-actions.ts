"use server";

import {GoogleGenAI} from "@google/genai";

export async function testGemini({prompt}: {prompt: string}) {
  const start = Date.now();

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const interaction = await ai.interactions.create({
    model: "gemini-3.8-flash",
    input: prompt,
    generation_config: {
      thinking_level: "low",
      //thinking_summaries: "auto",
      //max_output_tokens: 100,
    }
  });
  
  return {
    answer: interaction.output_text ?? "",
    duration: `${((Date.now() - start) / 1000).toFixed(1)} Sekunden`,
  };
}
