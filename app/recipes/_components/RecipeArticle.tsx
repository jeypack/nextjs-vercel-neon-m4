import {ArrowRight, Clock3, Globe2, Lock, Users} from "lucide-react";
import type {RecipeListItem} from "@/app/recipes/_lib/types";

export default function RecipeArticle({recipe}: {recipe: RecipeListItem}) {
  function getDifficultyLabel(difficulty: "EASY" | "MEDIUM" | "HARD") {
    if (difficulty === "EASY") {
      return "Einfach";
    }

    if (difficulty === "HARD") {
      return "Anspruchsvoll";
    }

    return "Mittel";
  }

  function getVisibilityLabel(isPublic: boolean) {
    return isPublic ? "Öffentlich" : "Privat";
  }

  return (
    <article
      key={recipe.id}
      className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-5 transition hover:border-emerald-300 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-emerald-900"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
          {recipe.categoryName}
        </span>

        <span className="text-xs text-neutral-500 dark:text-neutral-400">
          {getDifficultyLabel(recipe.difficulty)}
        </span>
      </div>

      <h3 className="mt-5 text-lg font-bold text-neutral-950 dark:text-white">
        {recipe.title}
      </h3>

      <p className="mt-2 min-h-12 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
        {recipe.description ?? "Keine Beschreibung vorhanden."}
      </p>

      <div className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full border border-neutral-200 px-2.5 py-1 text-xs font-medium text-neutral-600 dark:border-neutral-700 dark:text-neutral-300">
        {recipe.isPublic ? (
          <Globe2 className="size-3.5" />
        ) : (
          <Lock className="size-3.5" />
        )}
        {getVisibilityLabel(recipe.isPublic)}
      </div>

      <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t border-neutral-100 pt-4 text-sm text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
        <span className="inline-flex items-center gap-1.5">
          <Clock3 className="size-4" />
          {recipe.prepTime} Min.
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Users className="size-4" />
          {recipe.servings} Portionen
        </span>
      </div>

      <div className="mt-5">
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
          Rezept ansehen
          <ArrowRight className="size-4" />
        </span>
      </div>
    </article>
  );
}
