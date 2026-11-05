import type {RecipeSuggestion} from "@/app/cook/_lib/types";
import RecipeCard from "@/app/cook/_components/RecipeCard";

type Props = {
  recipes: RecipeSuggestion[];
  hasSearched: boolean;
  userId?: number | null;
};

export default function RecipeSuggestions({recipes, hasSearched, userId}: Props) {
  console.log("userId:", userId);
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
        <RecipeCard key={recipe.id} recipe={recipe} userId={userId} />
      ))}
    </div>
  );
}
