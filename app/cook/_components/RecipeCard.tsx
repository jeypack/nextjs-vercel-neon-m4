"use client";

import type {RecipeSuggestion} from "@/app/cook/_lib/types";
import {useModal} from "@/app/_context/ModalContext";
import AddToMealPlanDialog from "@/app/meal-plan/_components/AddToMealPlanDialog";

interface Props {
  recipe: RecipeSuggestion;
  userId?: number | null;
}

export default function RecipeCard({recipe, userId}: Props) {
  const {open, close} = useModal();

  const isLoggedIn = userId !== null && userId !== undefined;

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
          {recipe.category}
        </p>

        <h3 className="mt-1 text-lg font-semibold">{recipe.title}</h3>

        {recipe.description && (
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            {recipe.description}
          </p>
        )}

        <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
          {recipe.prepTime} Min. · {recipe.servings} Portionen
        </p>
      </div>

      <div>
        <p className="text-sm font-medium">
          Das hast du bereits ({recipe.matchedCount}/
          {recipe.totalIngredientCount})
        </p>

        <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-400">
          {recipe.matchedIngredients.length > 0
            ? recipe.matchedIngredients.join(", ")
            : "Noch keine passende Zutat gewählt."}
        </p>
      </div>

      <div>
        <p className="text-sm font-medium">
          Das fehlt noch ({recipe.missingCount})
        </p>

        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          {recipe.missingIngredients.length > 0
            ? recipe.missingIngredients.join(", ")
            : "Du hast alle Zutaten!"}
        </p>
      </div>

      <details className="border-t border-neutral-200 pt-3 dark:border-neutral-800">
        <summary className="cursor-pointer text-sm font-medium">
          Zubereitung anzeigen
        </summary>

        <p className="mt-3 whitespace-pre-line text-sm leading-6 text-neutral-600 dark:text-neutral-400">
          {recipe.instructions}
        </p>
      </details>

      <button
        type="button"
        disabled={!isLoggedIn}
        title={
          isLoggedIn
            ? "Zum Essensplan hinzufügen"
            : "Bitte melde dich an, um diese Funktion zu nutzen."
        }
        className={
          "mt-auto rounded-lg bg-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400" +
          (isLoggedIn
            ? " cursor-pointer hover:bg-neutral-300 dark:hover:bg-neutral-700"
            : " cursor-not-allowed")
        }
        onClick={() => {
          if (!isLoggedIn) return;

          open(
            `${recipe.title} zum Wochenplan hinzufügen`,
            <AddToMealPlanDialog recipeId={recipe.id} onCancel={close} />,
          );
        }}
      >
        Zum Wochenplan hinzufügen
      </button>
    </article>
  );
}
