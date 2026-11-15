import Link from "next/link";
import {notFound} from "next/navigation";
import {ArrowLeft, Clock3, Globe2, Lock, Pencil, Users} from "lucide-react";
import {getCurrentUser} from "@/lib/auth/session";
import {getRecipeDetailForViewer} from "@/app/recipes/_lib/queries";
import AddToMealPlanButton from "@/app/meal-plan/_components/AddToMealPlanButton";

function getDifficultyLabel(difficulty: "EASY" | "MEDIUM" | "HARD") {
  if (difficulty === "EASY") {
    return "Einfach";
  }

  if (difficulty === "HARD") {
    return "Anspruchsvoll";
  }

  return "Mittel";
}

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{id: string}>;
}) {
  const resolvedParams = await params;
  const recipeId = Number(resolvedParams.id);

  if (!Number.isInteger(recipeId) || recipeId <= 0) {
    notFound();
  }

  const user = await getCurrentUser();
  const recipe = await getRecipeDetailForViewer(recipeId, user?.id ?? null);

  if (!recipe) {
    notFound();
  }

  const canEdit =
    user !== null && (user.role === "ADMIN" || recipe.userId === user.id);

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:py-16">
      <section className="flex items-center justify-between gap-4">
        <Link
          href="/recipes"
          className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 transition hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
          scroll={false}
        >
          <ArrowLeft className="size-4" />
          <span className="hidden sm:inline">Zurück zur Rezeptübersicht</span>
        </Link>
        {canEdit && (
          <Link
            href={`/recipes/${recipe.id}/edit`}
            className="inline-flex items-center gap-2 grow text-sm font-medium text-emerald-700 transition hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
            scroll={false}
          >
            <Pencil className="size-4" />
            Rezept bearbeiten
          </Link>
        )}
        {user !== null && <AddToMealPlanButton recipe={recipe} />}
      </section>

      <section className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900 sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            {recipe.categoryName}
          </span>
          <span className="rounded-full border border-neutral-200 px-3 py-1 text-xs font-medium text-neutral-600 dark:border-neutral-700 dark:text-neutral-300">
            {getDifficultyLabel(recipe.difficulty)}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 px-3 py-1 text-xs font-medium text-neutral-600 dark:border-neutral-700 dark:text-neutral-300">
            {recipe.isPublic ? (
              <Globe2 className="size-3.5" />
            ) : (
              <Lock className="size-3.5" />
            )}
            {recipe.isPublic ? "Öffentlich" : "Privat"}
          </span>
        </div>

        <h1 className="mt-4 text-2xl font-bold tracking-tight text-neutral-950 dark:text-white sm:text-3xl">
          {recipe.title}
        </h1>

        {recipe.description ? (
          <p className="mt-3 text-neutral-600 dark:text-neutral-300">
            {recipe.description}
          </p>
        ) : null}

        <div className="mt-5 flex flex-wrap gap-4 border-t border-neutral-100 pt-4 text-sm text-neutral-600 dark:border-neutral-800 dark:text-neutral-300">
          <span className="inline-flex items-center gap-1.5">
            <Clock3 className="size-4" />
            {recipe.prepTime} Min.
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users className="size-4" />
            {recipe.servings} Portionen
          </span>
          {recipe.ownerName ? <span>Von {recipe.ownerName}</span> : null}
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900 sm:p-8">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
          Zutaten
        </h2>
        <ul className="mt-4 space-y-2">
          {recipe.ingredients.map((ingredient) => (
            <li
              key={ingredient.id}
              className="rounded-lg border border-neutral-100 px-3 py-2 text-sm text-neutral-700 dark:border-neutral-800 dark:text-neutral-200"
            >
              <span className="font-medium">{ingredient.name}</span>
              {ingredient.amount !== null ? ` — ${ingredient.amount}` : ""}
              {ingredient.unit ? ` ${ingredient.unit}` : ""}
              {ingredient.notes ? ` (${ingredient.notes})` : ""}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900 sm:p-8">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
          Zubereitung
        </h2>
        <p className="mt-4 whitespace-pre-line leading-7 text-neutral-700 dark:text-neutral-200">
          {recipe.instructions}
        </p>
      </section>
    </main>
  );
}
