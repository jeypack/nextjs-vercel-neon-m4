import type {RecipeSuggestion} from "@/app/cook/_lib/types";

type Props = {
  recipes: RecipeSuggestion[];
  hasSearched: boolean;
};

export default function RecipeSuggestions({recipes, hasSearched}: Props) {
  if (!hasSearched) {
    return (
      <p className="text-sm text-neutral-600 dark:text-neutral-400">
        Wähle deine Zutaten aus und finde heraus, was du damit kochen kannst.
      </p>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-neutral-300 p-6 text-center dark:border-neutral-700">
        <p className="font-medium">Noch keine passenden Rezepte</p>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          Probiere weitere Zutaten oder eine andere Auswahl.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {recipes.map((recipe) => (
        <article
          key={recipe.id}
          className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
        >
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
              Das hast du bereits ({recipe.matchedIngredients.length})
            </p>

            <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-400">
              {recipe.matchedIngredients.join(", ")}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium">
              Das fehlt noch ({recipe.missingIngredients.length})
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
            disabled
            title="Die Funktion ergänzen wir im nächsten Schritt."
            className="mt-auto cursor-not-allowed rounded-lg bg-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
          >
            Zum Essensplan hinzufügen
          </button>
        </article>
      ))}
    </div>
  );
}
