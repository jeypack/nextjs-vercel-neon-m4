"use client";

import {useState, useTransition, type SubmitEvent} from "react";
import {
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
} from "@headlessui/react";

import IngredientChips from "./IngredientChips";
import RecipeSuggestions from "./RecipeSuggestions";
import {searchRecipes} from "@/app/cook/_lib/actions";
import type {RecipeSuggestion} from "@/app/cook/_lib/types";
import {emeraldButton, neutralButton} from "@/app/_lib/tailwind";

type Props = {
  ingredientNames: string[];
};

type IngredientComboboxProps = {
  ingredientNames: string[];
  value: string;
  onChange: (value: string) => void;
  onAdd: (value: string) => void;
};

function IngredientCombobox({
  ingredientNames,
  value,
  onChange,
  onAdd,
}: IngredientComboboxProps) {
  const normalizedValue = value.trim().toLocaleLowerCase("de-DE");

  const filteredIngredients = normalizedValue
    ? ingredientNames.filter((name) =>
        name.toLocaleLowerCase("de-DE").includes(normalizedValue),
      )
    : ingredientNames;

  return (
    <Combobox
      value={value}
      onChange={(selected: string | null) => {
        if (selected) {
          onAdd(selected);
        }
      }}
      onClose={() => onChange("")}
    >
      <div className="relative min-w-0 flex-1">
        <ComboboxInput
          id="ingredient"
          autoComplete="off"
          displayValue={(ingredient: string) => ingredient}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();

              const exactMatch = ingredientNames.find(
                (name) => name.toLocaleLowerCase("de-DE") === normalizedValue,
              );

              onAdd(exactMatch ?? value);
            }
          }}
          placeholder="z. B. Tomate, Zwiebel, Pasta"
          className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-base text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100 dark:placeholder:text-neutral-500"
        />

        <ComboboxOptions
          anchor="bottom"
          className="z-10 mt-1 max-h-60 w-(--input-width) overflow-auto rounded-lg border border-neutral-200 bg-white p-1 shadow-lg empty:invisible dark:border-neutral-700 dark:bg-neutral-900"
        >
          {filteredIngredients.map((name) => (
            <ComboboxOption
              key={name}
              value={name}
              className="cursor-pointer rounded-md px-3 py-2 text-sm text-neutral-800 data-focus:bg-emerald-50 data-focus:text-emerald-900 dark:text-neutral-100 dark:data-focus:bg-emerald-950 dark:data-focus:text-emerald-200"
            >
              {name}
            </ComboboxOption>
          ))}
        </ComboboxOptions>
      </div>
    </Combobox>
  );
}

export default function IngredientInput({ingredientNames}: Props) {
  const [input, setInput] = useState("");
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<RecipeSuggestion[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function addIngredient(value = input) {
    const ingredient = value.trim();

    if (!ingredient) return;

    const exists = selectedIngredients.some(
      (item) =>
        item.toLocaleLowerCase("de-DE") ===
        ingredient.toLocaleLowerCase("de-DE"),
    );

    if (!exists) {
      setSelectedIngredients((current) => [...current, ingredient]);
    }

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

    const ingredients = [...selectedIngredients];
    const currentInput = input.trim();

    if (currentInput) {
      const exists = ingredients.some(
        (item) =>
          item.toLocaleLowerCase("de-DE") ===
          currentInput.toLocaleLowerCase("de-DE"),
      );

      if (!exists) {
        ingredients.push(currentInput);
      }
    }

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

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-6 dark:border-neutral-800 dark:bg-neutral-900">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="ingredient"
              className="mb-2 block text-sm font-medium"
            >
              Welche Zutaten hast du noch?
            </label>

            <div className="flex flex-col gap-2 sm:flex-row">
              <IngredientCombobox
                ingredientNames={ingredientNames}
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
            </div>

            <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
              Wähle eine vorhandene Zutat oder gib eine eigene ein.
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

          <button type="submit" disabled={isPending} className={emeraldButton}>
            {isPending ? "Rezepte werden gesucht …" : "Rezepte finden"}
          </button>
        </form>
      </section>

      <section aria-live="polite" className="space-y-4">
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
