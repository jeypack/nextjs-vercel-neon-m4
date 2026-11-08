"use client";

import type {
  RecipeSuggestion,
  GeminiRecipeSuggestion,
} from "@/app/cook/_lib/types";
import RecipeCard from "./RecipeCard";

interface Props {
  recipes: RecipeSuggestion[];
  geminiRecipes: GeminiRecipeSuggestion[];
  hasSearched: boolean;
  userId?: number | null;
  onImport: (recipe: GeminiRecipeSuggestion) => void;
}

export default function RecipeSuggestions({
  recipes,
  geminiRecipes,
  hasSearched,
  userId,
  onImport,
}: Props) {
  if (!hasSearched) return null;

  if (recipes.length === 0 && geminiRecipes.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        Leider haben wir keine passenden Rezepte gefunden.
      </p>
    );
  }

  return (
    <div className="space-y-10">
      {/* Gemini-Vorschläge */}
      {geminiRecipes.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">KI-Rezeptvorschläge</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            {geminiRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                userId={userId}
                onImport={onImport}
              />
            ))}
          </div>
        </section>
      )}

      {/* Normale Datenbank-Rezepte */}
      {recipes.length > 0 && (
        <section className="space-y-4">
          
          <div className="grid gap-4 sm:grid-cols-2">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} userId={userId} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
