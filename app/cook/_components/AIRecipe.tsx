"use client";

import {useState} from "react";
import {testGemini} from "@/app/cook/_lib/ai-actions";
import {emeraldButton} from "@/app/_lib/tailwind";

export default function GeminiTest() {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("Nenne ein leckeres Gericht mit Tomaten.");

  async function handleTest() {
    setLoading(true);
    setResult("");

    try {
      const response = await testGemini({prompt});
      setResult(`${response.answer}\nDauer: ${response.duration}`);
    } catch (error) {
      setResult(error instanceof Error ? error.message : "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="text-gray-500">
        <span>Prompt:</span>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="ml-2 border border-gray-500 text-emerald-800 dark:text-emerald-50 rounded px-2 py-1 w-100"
        />
      </div>
      <button
        type="button"
        onClick={handleTest}
        disabled={loading}
        className={emeraldButton}
      >
        {loading ? "Gemini antwortet …" : "Gemini testen"}
      </button>

      {result && <pre className="whitespace-pre-wrap text-sm text-emerald-800 dark:text-emerald-50">{result}</pre>}
    </div>
  );
}
