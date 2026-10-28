import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  ChefHat,
  Clock3,
  Globe2,
  Lock,
  Plus,
  Sparkles,
  Users,
} from "lucide-react";
import Chip from "@/app/_components/Chip";
import {getCurrentUser} from "@/lib/auth/session";
import {
  getRecipeCategoryOptions,
  getRecipesForListing,
} from "@/app/recipes/_lib/queries";
import type {
  RecipeFilters,
  RecipesPageSearchParams,
  RecipeVisibilityFilter,
} from "@/app/recipes/_lib/types";
import {getRecipeSearchOptions} from "@/app/recipes/_lib/queries";
import RecipeSearchCombobox from "@/app/recipes/_components/RecipeSearchCombobox";
import RecipeFiltersForm from "@/app/recipes/_components/RecipeFiltersForm";

export const metadata = {
  title: "Rezepte",
  description: "Durchsuche und filtere deine Rezepte",
};

function getSearchParamValue(
  value: string | string[] | undefined,
): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function parseFilters(searchParams: RecipesPageSearchParams): RecipeFilters {
  const searchQuery = getSearchParamValue(searchParams.q)?.trim() ?? "";
  const categorySlug = getSearchParamValue(searchParams.category)?.trim() ?? "";
  const visibility = getSearchParamValue(searchParams.visibility)?.trim();

  const visibilityFilter: RecipeVisibilityFilter =
    visibility === "public" || visibility === "private" ? visibility : "all";

  return {
    searchQuery: searchQuery.slice(0, 100),
    categorySlug: categorySlug || "all",
    visibility: visibilityFilter,
  };
}

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

export default async function RecipesPage({
  searchParams,
}: {
  searchParams: Promise<RecipesPageSearchParams>;
}) {
  const user = await getCurrentUser();
  const recipeSearchOptions = await getRecipeSearchOptions(user?.id ?? null);
  const parsedFilters = parseFilters(await searchParams);
  const categories = await getRecipeCategoryOptions();
  const hasCategory = categories.some(
    (category) => category.slug === parsedFilters.categorySlug,
  );

  const filters: RecipeFilters = {
    ...parsedFilters,
    categorySlug:
      parsedFilters.categorySlug === "all" || hasCategory
        ? parsedFilters.categorySlug
        : "all",
  };

  const activeFilterCount = [
    filters.searchQuery.length > 0,
    filters.categorySlug !== "all",
    filters.visibility !== "all",
  ].filter(Boolean).length;

  const {recipes, totalCount} = await getRecipesForListing(
    filters,
    user?.id ?? null,
  );

  const makeFilterHref = (nextFilters: Partial<RecipeFilters>) => {
    const merged: RecipeFilters = {
      ...filters,
      ...nextFilters,
    };
    const params = new URLSearchParams();

    if (merged.searchQuery) {
      params.set("q", merged.searchQuery);
    }

    if (merged.categorySlug !== "all") {
      params.set("category", merged.categorySlug);
    }

    if (merged.visibility !== "all") {
      params.set("visibility", merged.visibility);
    }

    const query = params.toString();
    return query ? `/recipes?${query}` : "/recipes";
  };

  const categoryFilterItems = [
    {slug: "all", name: "Alle"},
    ...categories.map((category) => ({
      slug: category.slug,
      name: category.name,
    })),
  ];

  const activeVisibilityRequiresLogin =
    filters.visibility === "private" && !user;

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:py-16">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Chip>
            <BookOpen className="size-4" />
            Deine Rezeptsammlung
          </Chip>

          <h1 className="text-3xl font-bold tracking-tight text-neutral-950 dark:text-white sm:text-4xl">
            Rezepte entdecken
          </h1>

          <p className="mt-3 max-w-2xl text-neutral-600 dark:text-neutral-400">
            Finde dein nächstes Lieblingsgericht oder lass dich von deinen
            Vorräten inspirieren.
          </p>
        </div>

        <Link
          href="/recipes/new"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
        >
          <Plus className="size-4" />
          Rezept erstellen
        </Link>
      </div>

      {/* Cook feature */}
      <section className="relative mt-8 overflow-hidden rounded-3xl bg-emerald-950 p-6 text-white sm:p-8">
        <div className="relative z-10 max-w-2xl">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-emerald-300">
            <Sparkles className="size-4" />
            Clever kochen statt wegwerfen
          </div>

          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Was steckt noch in deinem Kühlschrank?
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-6 text-emerald-100/80 sm:text-base">
            Gib deine vorhandenen Zutaten ein und entdecke passende Gerichte –
            inklusive fehlender Zutaten.
          </p>

          <Link
            href="/cook"
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-50"
          >
            Rezepte aus Resten finden
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <ChefHat
          aria-hidden="true"
          className="absolute -bottom-8 -right-5 size-44 text-emerald-800/50 sm:right-8 sm:size-56"
        />
      </section>

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold text-neutral-950 dark:text-white">
          Rezept schnell finden
        </h2>

        <RecipeSearchCombobox recipes={recipeSearchOptions} />
      </section>

      <section className="mt-10">
        <RecipeFiltersForm
          filters={filters}
          activeFilterCount={activeFilterCount}
          canViewPrivateRecipes={Boolean(user)}
        />

        <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
          {categoryFilterItems.map((category) => (
            <Link
              key={category.slug}
              href={makeFilterHref({categorySlug: category.slug})}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                filters.categorySlug === category.slug
                  ? "bg-emerald-600 text-white"
                  : "border border-neutral-200 text-neutral-600 hover:border-emerald-600 hover:text-emerald-700 dark:border-neutral-700 dark:text-neutral-300 dark:hover:text-emerald-400"
              }`}
            >
              {category.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-5 flex items-baseline justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-neutral-950 dark:text-white">
              Alle Rezepte
            </h2>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              {activeFilterCount > 0
                ? "Deine gefilterten Ergebnisse"
                : "Eine Auswahl aus deiner Rezeptsammlung"}
            </p>
          </div>

          <span className="shrink-0 text-sm text-neutral-500 dark:text-neutral-400">
            {totalCount} {totalCount === 1 ? "Rezept" : "Rezepte"}
          </span>
        </div>

        {activeVisibilityRequiresLogin ? (
          <div className="rounded-2xl border border-dashed border-neutral-300 p-6 text-center dark:border-neutral-700">
            <p className="font-medium">
              Private Rezepte nur für eingeloggte Nutzer
            </p>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              Melde dich an, um deine privaten Rezepte zu sehen.
            </p>
            <Link
              href="/user"
              className="mt-4 inline-flex min-h-11 items-center justify-center rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Zum Login
            </Link>
          </div>
        ) : recipes.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-300 p-6 text-center dark:border-neutral-700">
            <p className="font-medium">Keine passenden Rezepte gefunden</p>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              Passe Suchbegriff oder Filter an und versuche es erneut.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {recipes.map((recipe) => (
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
            ))}
          </div>
        )}
      </section>

      <section className="mt-10 flex flex-col gap-4 rounded-2xl border border-neutral-200 p-6 sm:flex-row sm:items-center sm:justify-between dark:border-neutral-800">
        <div>
          <h2 className="font-semibold text-neutral-950 dark:text-white">
            Schon deinen Wochenplan vorbereitet?
          </h2>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            Plane deine Lieblingsgerichte für die kommende Woche.
          </p>
        </div>

        <Link
          href="/meal-plan"
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-neutral-200 px-4 py-3 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-900"
        >
          Zum Wochenplan
          <ArrowRight className="size-4" />
        </Link>
      </section>
    </main>
  );
}
