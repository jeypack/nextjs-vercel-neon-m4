"use client";

import type {
  RecipeSuggestion,
  GeminiRecipeSuggestion,
} from "@/app/cook/_lib/types";
import {useModal} from "@/app/_context/ModalContext";
import AddToMealPlanDialog from "@/app/meal-plan/_components/AddToMealPlanDialog";

interface Props {
  recipe: RecipeSuggestion | GeminiRecipeSuggestion;
  userId?: number | null;
  onImport?: (recipe: GeminiRecipeSuggestion) => void;
}

//Type Predicate to check if a recipe is a GeminiRecipeSuggestion
function isGeminiRecipe(
  recipe: RecipeSuggestion | GeminiRecipeSuggestion,
): recipe is GeminiRecipeSuggestion {
  return typeof recipe.id === "string";
}

export default function RecipeCard({recipe, userId, onImport}: Props) {
  const {open, close} = useModal();

  const isLoggedIn = userId !== null && userId !== undefined;
  const isGemini = isGeminiRecipe(recipe);

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
          {isGemini ? "Gemini-Vorschlag" : recipe.category}
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

      {isGemini ? (
        <div>
          <p className="text-sm font-medium">
            Zutaten ({recipe.ingredients.length})
          </p>

          <ul className="mt-2 space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={`${ingredient.name}-${index}`}>
                {ingredient.amount !== null && (
                  <>
                    {ingredient.amount} {ingredient.unit}{" "}
                  </>
                )}
                {ingredient.name}
                {ingredient.notes && ` (${ingredient.notes})`}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <>
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
        </>
      )}

      <details className="border-t border-neutral-200 pt-3 dark:border-neutral-800">
        <summary className="cursor-pointer text-sm font-medium">
          Zubereitung anzeigen
        </summary>

        {isGemini ? (
          <ol className="mt-3 list-inside list-decimal space-y-2 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
            {recipe.instructions
              .split("\n")
              .filter(Boolean)
              .map((step, index) => (
                <li key={index}>{step}</li>
              ))}
          </ol>
        ) : (
          <p className="mt-3 whitespace-pre-line text-sm leading-6 text-neutral-600 dark:text-neutral-400">
            {recipe.instructions}
          </p>
        )}
      </details>

      {isGemini ? (
        <button
          type="button"
          disabled={!isLoggedIn || !onImport}
          title={
            !isLoggedIn
              ? "Bitte melde dich an, um ein Rezept zu übernehmen."
              : "Rezept in dein Rezeptformular übernehmen"
          }
          className={
            "mt-auto rounded-lg px-4 py-2.5 text-sm font-medium " +
            (isLoggedIn && onImport
              ? "cursor-pointer bg-emerald-600 text-white hover:bg-emerald-700"
              : "cursor-not-allowed bg-neutral-200 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400")
          }
          onClick={() => {
            if (!isLoggedIn || !onImport) return;
            onImport(recipe);
          }}
        >
          Rezept übernehmen
        </button>
      ) : (
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
      )}
    </article>
  );
}
