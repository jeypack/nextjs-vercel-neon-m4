"use client";

import {useState, useTransition, type SubmitEvent} from "react";
import IngredientChips from "./IngredientChips";
import FilterCombobox from "@/app/_components/FilterCombobox";
import RecipeSuggestions from "./RecipeSuggestions";
import {searchRecipes} from "@/app/cook/_lib/actions";
import type {RecipeSuggestion} from "@/app/cook/_lib/types";
import {emeraldButton, neutralButton, panelClass} from "@/app/_lib/tailwind";
import LoginButton from "@/app/user/_components/LoginButton";

type Props = {
  ingredientNames: string[];
  pantryIngredientNames: string[];
  userId: number | null;
};

export default function IngredientInput({
  ingredientNames,
  pantryIngredientNames,
  userId,
}: Props) {
  const [input, setInput] = useState("");
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<RecipeSuggestion[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  
  function normalizeIngredient(value: string) {
    return value.trim().toLocaleLowerCase("de-DE");
  }

  function mergeUniqueIngredients(current: string[], incoming: string[]) {
    const merged = [...current];
    const seen = new Set(current.map(normalizeIngredient));

    for (const item of incoming) {
      const ingredient = item.trim();
      if (!ingredient) continue;

      const normalized = normalizeIngredient(ingredient);
      if (seen.has(normalized)) continue;

      seen.add(normalized);
      merged.push(ingredient);
    }

    return merged;
  }

  function addIngredient(value = input) {
    const ingredient = value.trim();
    if (!ingredient) return;

    setSelectedIngredients((current) =>
      mergeUniqueIngredients(current, [ingredient]),
    );

    setInput("");
    setError("");
  }

  function removeIngredient(ingredient: string) {
    setSelectedIngredients((current) =>
      current.filter((item) => item !== ingredient),
    );
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const ingredients = mergeUniqueIngredients(selectedIngredients, [input]);

    if (ingredients.length === 0) {
      setError("Gib mindestens eine Zutat ein.");
      return;
    }

    setSelectedIngredients(ingredients);
    setInput("");
    setError("");
    setHasSearched(true);

    startTransition(async () => {
      try {
        const result = await searchRecipes(ingredients);
        setRecipes(result);
      } catch {
        setRecipes([]);
        setError(
          "Die Rezeptsuche ist fehlgeschlagen. Bitte versuche es erneut.",
        );
      }
    });
  }

  function importFromPantry() {
    if (pantryIngredientNames.length === 0) {
      setError("Dein Vorrat ist leer. Lege zuerst Zutaten im Vorrat an.");
      return;
    }

    setSelectedIngredients((current) =>
      mergeUniqueIngredients(current, pantryIngredientNames),
    );
    setError("");
  }

  return (
    <div className="space-y-8">
      <section className={panelClass}>
        <form onSubmit={handleSubmit} className="space-y-4 p-8">
          <div>
            <label
              htmlFor="ingredient"
              className="mb-2 block text-sm font-medium"
            >
              Welche Zutaten hast du noch?
            </label>

            <div className="flex flex-col gap-2 sm:flex-row">
              <FilterCombobox
                options={ingredientNames}
                value={input}
                onChange={setInput}
                onAdd={addIngredient}
              />

              <button
                type="button"
                onClick={() => addIngredient()}
                disabled={!input.trim()}
                className={neutralButton}
              >
                Zutat hinzufügen
              </button>

              <button
                type="button"
                onClick={importFromPantry}
                disabled={pantryIngredientNames.length === 0}
                className={neutralButton}
              >
                Aus Vorrat übernehmen
              </button>
            </div>

            <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
              Wähle eine vorhandene Zutat, gib eine eigene ein oder übernimm
              Zutaten aus deinem Vorrat.
            </p>
          </div>

          <IngredientChips
            ingredients={selectedIngredients}
            onRemove={removeIngredient}
          />

          {error && (
            <p role="alert" className="text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}

          <div className="flex flex-col sm:flex-row justify-between items-end gap-2">
            <button
              type="submit"
              disabled={isPending}
              className={emeraldButton + " text-nowrap"}
            >
              {isPending ? "Rezepte werden gesucht …" : "Rezepte finden"}
            </button>
            {!userId && (
              <div className="flex flex-col grow sm:grow-0 sm:flex-row gap-2 items-center">
                <LoginButton />
                <p className="mx-2 text-sm text-neutral-600 dark:text-neutral-400 grow sm:order-first">
                  Bitte melde dich an, um deinen Vorrat zu nutzen.
                </p>
              </div>
            )}
          </div>
        </form>
      </section>

      <section aria-live="polite" className={`space-y-4 p-8 ${panelClass}`}>
        <div>
          <h2 className="text-xl font-semibold">
            Was kannst du daraus kochen?
          </h2>

          {hasSearched && !isPending && (
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
              {recipes.length}{" "}
              {recipes.length === 1 ? "Rezept gefunden" : "Rezepte gefunden"}
            </p>
          )}
        </div>

        {isPending ? (
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Wir suchen passende Rezepte …
          </p>
        ) : (
          <RecipeSuggestions recipes={recipes} hasSearched={hasSearched} />
        )}
      </section>
    </div>
  );
}
