"use client";

import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import {Search, X} from "lucide-react";
import {useRouter} from "next/navigation";
import {useMemo, useState} from "react";
import type {
  RecipeSearchComboboxProps,
  RecipeSearchOption,
} from "@/app/recipes/_lib/types";

export default function RecipeSearchCombobox({
  name,
  recipes,
  showDetail = true,
}: RecipeSearchComboboxProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedRecipe, setSelectedRecipe] =
    useState<RecipeSearchOption | null>(null);
  const [selectedId, setSelectedId] = useState<number | string | null>(null);

  const filteredRecipes = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("de-DE");

    const matches = normalizedQuery
      ? recipes.filter((recipe) =>
          recipe.title.toLocaleLowerCase("de-DE").includes(normalizedQuery),
        )
      : recipes;

    //return matches.slice(0, 10);
    return matches;
  }, [query, recipes]);

  function handleSelect(recipe: RecipeSearchOption | null) {
    if (!recipe) return;

    setSelectedRecipe(recipe);
    setSelectedId(recipe.id);
    //console.log("Selected recipe:", recipe);
    if (showDetail) {
      router.push(`/recipes/${recipe.id}`);
    }
  }

  function clearSelection() {
    setQuery("");
    setSelectedRecipe(null);
    setSelectedId(null);
  }

  //console.log("Filtered Recipes:", filteredRecipes);

  return (
    <div className="relative w-full">
      <input type="hidden" name={name} value={selectedId ?? ""} />
      <Combobox
        immediate={true}
        value={selectedRecipe}
        onChange={handleSelect}
        onClose={() => setQuery("")}
      >
        <div className="relative">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-neutral-400"
          />
          <div className="flex justify-between items-center">
            <ComboboxInput
              aria-label="Rezept suchen"
              placeholder="Rezeptnamen eingeben …"
              displayValue={(recipe: RecipeSearchOption | null) =>
                recipe?.title ?? ""
              }
              onChange={(event) => setQuery(event.target.value)}
              className="min-h-12 w-full rounded-xl border border-neutral-200 bg-white py-3 pl-12 pr-11 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
            />

            <button
              type="button"
              aria-label="Suche schließen"
              onClick={clearSelection}
              className="cursor-pointer border border-neutral-50 flex size-12 items-center justify-center rounded-xl text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-200 ml-px"
            >
              <X aria-hidden="true" className="size-4" />
            </button>
          </div>
        </div>

        <ComboboxOptions
          anchor="bottom"
          className="z-50 mt-2 w-(--input-width) overflow-y-auto rounded-xl border border-neutral-200 bg-white p-1 shadow-lg empty:invisible dark:border-neutral-700 dark:bg-neutral-900"
        >
          {filteredRecipes.length === 0 ? (
            <div className="px-3 py-4 text-sm text-neutral-500">
              Keine passenden Rezepte gefunden.
            </div>
          ) : (
            filteredRecipes.map((recipe) => (
              <ComboboxOption
                key={recipe.id}
                value={recipe}
                className="cursor-pointer rounded-lg px-3 py-2.5 text-sm text-neutral-700 data-focus:bg-emerald-50 data-focus:text-emerald-950 dark:text-neutral-200 dark:data-focus:bg-emerald-950 dark:data-focus:text-emerald-100"
              >
                {recipe.title}
              </ComboboxOption>
            ))
          )}
        </ComboboxOptions>
      </Combobox>

      {showDetail && (
        <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
          Wähle ein Rezept aus, um direkt zu den Details zu gelangen.
        </p>
      )}
    </div>
  );
}
