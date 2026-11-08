"use client";

import {
  useState,
  useTransition,
  type SubmitEvent,
  type SetStateAction,
} from "react";

import IngredientChips from "./IngredientChips";
import FilterCombobox from "@/app/_components/FilterCombobox";
import RecipeSuggestions from "./RecipeSuggestions";
import RecipeCreateForm from "@/app/recipes/new/_components/RecipeCreateForm";

import {searchRecipes} from "@/app/cook/_lib/actions";
import {generateGeminiRecipes} from "@/app/cook/_lib/ai-actions";

import type {GeminiRecipeSuggestion} from "@/app/cook/_lib/types";
import type {
  RecipeCreateCategoryOption,
  RecipeFormInitialValues,
} from "@/app/recipes/_lib/types";

import {emeraldButton, neutralButton, panelClass} from "@/app/_lib/tailwind";
import LoginButton from "@/app/user/_components/LoginButton";
import {Switch} from "@headlessui/react";
import {useData} from "@/app/_context/DataContext";

type Props = {
  ingredientNames: string[];
  pantryIngredientNames: string[];
  categories: RecipeCreateCategoryOption[];
  unitNames: string[];
  userId: number | null;
};

type GeminiResponse = {
  recipes: {
    recipe_name: string;
    description: string;
    prep_time_minutes: number;
    servings: number;
    instructions: string[];
    ingredients: {
      name: string;
      amount: number | null;
      unit: string | null;
      notes: string;
    }[];
  }[];
};

export default function IngredientInput({
  ingredientNames,
  pantryIngredientNames,
  categories,
  unitNames,
  userId,
}: Props) {
  const {cookSearch, setCookSearch} = useData();

  const {
    input,
    selectedIngredients,
    recipes,
    geminiRecipes,
    hasSearched,
    geminiEnabled,
  } = cookSearch;

  const [importedRecipe, setImportedRecipe] =
    useState<GeminiRecipeSuggestion | null>(null);

  const [error, setError] = useState("");

  const [isSearching, startSearchTransition] = useTransition();
  const [isGeminiPending, startGeminiTransition] = useTransition();

  const isPending = isSearching || isGeminiPending;

  // Context-State aktualisieren

  function setInput(value: string) {
    setCookSearch((current) => ({
      ...current,
      input: value,
    }));
  }

  function setSelectedIngredients(action: SetStateAction<string[]>) {
    setCookSearch((current) => ({
      ...current,
      selectedIngredients:
        typeof action === "function"
          ? action(current.selectedIngredients)
          : action,
    }));
  }

  function setGeminiEnabled(value: boolean) {
    setCookSearch((current) => ({
      ...current,
      geminiEnabled: value,
    }));
  }

  // Zutaten verarbeiten

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

  // Gemini-Rezept übernehmen

  function handleImport(recipe: GeminiRecipeSuggestion) {
    setImportedRecipe(recipe);
  }

  // Rezeptsuche

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const ingredients = mergeUniqueIngredients(selectedIngredients, [input]);

    if (ingredients.length === 0) {
      setError("Gib mindestens eine Zutat ein.");
      return;
    }

    setError("");
    setImportedRecipe(null);

    // Suchdaten im Context aktualisieren
    setCookSearch((current) => ({
      ...current,
      input: "",
      selectedIngredients: ingredients,
      recipes: [],
      geminiRecipes: [],
      hasSearched: true,
    }));

    // Normale Datenbank-Rezepte suchen
    startSearchTransition(async () => {
      try {
        const result = await searchRecipes(ingredients);

        setCookSearch((current) => ({
          ...current,
          recipes: result,
        }));
      } catch {
        setCookSearch((current) => ({
          ...current,
          recipes: [],
        }));

        setError(
          "Die Rezeptsuche ist fehlgeschlagen. Bitte versuche es erneut.",
        );
      }
    });

    // Gemini nur bei aktivierter Suche aufrufen
    if (geminiEnabled && userId) {
      startGeminiTransition(async () => {
        try {
          const result = await generateGeminiRecipes({
            prompt: ingredients.join(", "),
          });

          const parsed = JSON.parse(result.answer) as GeminiResponse;

          const normalizedRecipes: GeminiRecipeSuggestion[] =
            parsed.recipes.map((recipe) => ({
              id: crypto.randomUUID(),
              title: recipe.recipe_name,
              description: recipe.description,
              prepTime: recipe.prep_time_minutes,
              servings: recipe.servings,
              instructions: recipe.instructions.join("\n"),
              ingredients: recipe.ingredients.map((ingredient) => ({
                name: ingredient.name,
                amount: ingredient.amount,
                unit: ingredient.unit ?? "",
                notes: ingredient.notes ?? "",
              })),
            }));

          setCookSearch((current) => ({
            ...current,
            geminiRecipes: normalizedRecipes,
          }));
        } catch {
          setCookSearch((current) => ({
            ...current,
            geminiRecipes: [],
          }));

          setError(
            "Die KI-Rezeptvorschläge konnten leider nicht geladen werden.",
          );
        }
      });
    }
  }

  // Gemini-Daten für das Rezeptformular vorbereiten

  const initialValues: RecipeFormInitialValues | undefined = importedRecipe
    ? {
        title: importedRecipe.title,
        description: importedRecipe.description,
        instructions: importedRecipe.instructions,
        prepTime: importedRecipe.prepTime,
        servings: importedRecipe.servings,
        ingredients: importedRecipe.ingredients,
      }
    : undefined;

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

          <div className="flex flex-col items-end justify-between gap-2 sm:flex-row">
            <button
              type="submit"
              disabled={isPending}
              className={emeraldButton + " text-nowrap"}
            >
              {isPending ? "Rezepte werden gesucht …" : "Rezepte finden"}
            </button>

            {!userId ? (
              <div className="flex grow flex-col items-center gap-2 sm:grow-0 sm:flex-row">
                <LoginButton />

                <p className="mx-2 grow text-sm text-neutral-600 dark:text-neutral-400 sm:order-first">
                  Bitte melde dich an, um deinen Vorrat zu nutzen.
                </p>
              </div>
            ) : (
              <div className="flex grow flex-col items-center gap-2 sm:grow-0 sm:flex-row">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  Mit Gemini suchen
                </span>

                <Switch
                  checked={geminiEnabled}
                  name="gemini"
                  onChange={setGeminiEnabled}
                  className="group relative flex h-7 w-14 cursor-pointer rounded-full bg-emerald-600 p-1 ease-in-out focus:not-data-focus:outline-none data-checked:bg-emerald-400 data-focus:outline data-focus:outline-white dark:bg-white/10 dark:data-checked:bg-white/10"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none inline-block size-5 translate-x-0 rounded-full border border-white bg-white/50 p-0.5 shadow-lg ring-0 transition duration-200 ease-in-out group-data-checked:translate-x-7 group-data-checked:bg-white"
                  />
                </Switch>
              </div>
            )}
          </div>
        </form>
      </section>

      {/* Formular zum Übernehmen eines Gemini-Rezepts */}
      {importedRecipe && initialValues ? (
        <section className={panelClass}>
          <div className="p-8">
            <h2 className="mb-4 text-xl font-semibold">
              Rezept übernehmen und speichern
            </h2>

            <RecipeCreateForm
              key={importedRecipe.id}
              categories={categories}
              ingredientNames={ingredientNames}
              unitNames={unitNames}
              initialValues={initialValues}
            />
          </div>
        </section>
      ) : (
        /* Rezeptvorschläge */
        <section aria-live="polite" className={`space-y-4 p-8 ${panelClass}`}>
          <div>
            <h2 className="text-xl font-semibold">
              Was kannst du daraus kochen?
            </h2>

            {hasSearched && !isSearching && (
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                {recipes.length}{" "}
                {recipes.length === 1 ? "Rezept gefunden" : "Rezepte gefunden"}
              </p>
            )}
          </div>

          {isSearching && (
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Wir suchen passende Rezepte …
            </p>
          )}

          {isGeminiPending && (
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Gemini sucht weitere Rezeptideen …
            </p>
          )}

          <RecipeSuggestions
            recipes={recipes}
            geminiRecipes={geminiRecipes}
            hasSearched={hasSearched}
            userId={userId}
            onImport={handleImport}
          />
        </section>
      )}
    </div>
  );
}
