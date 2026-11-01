import type {RecipeListItem} from "@/app/recipes/_lib/types";
import RecipeArticle from "@/app/recipes/_components/RecipeArticle";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Lock,
  Plus,
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
import RecipeHero from "@/app/recipes/_components/RecipeHero";
import CategoryFilter from "@/app/recipes/_components/CategoryFilter";
import MealPlanBanner from "@/app/_components/MealPlanBanner";

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

  /* const activeVisibilityRequiresLogin =
    filters.visibility === "private" && !user; */

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
            Finde dein nächstes Lieblingsgericht – lass dich inspirieren.
          </p>
        </div>

        {user ? (
          <Link
            href="/recipes/new"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
          >
            <Plus className="size-4" />
            Rezept erstellen
          </Link>
        ) : (
          <Link
            href="/user"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
          >
            <Lock className="size-4" />
            Anmelden, um Rezepte zu erstellen
          </Link>
        )}
      </div>

      <RecipeHero />

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold text-neutral-950 dark:text-white">
          Rezept schnell finden
        </h2>

        <RecipeSearchCombobox recipes={recipeSearchOptions} />
      </section>

      <section className="mt-10">
        <RecipeFiltersForm
          filters={filters}
          canViewPrivateRecipes={Boolean(user)}
        />

        <CategoryFilter
          categoryFilterItems={categoryFilterItems}
          filters={filters}
          makeFilterHref={makeFilterHref}
        />
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
                : "Eine Auswahl aus der Rezeptsammlung"}
            </p>
          </div>

          <span className="shrink-0 text-sm text-neutral-500 dark:text-neutral-400">
            {totalCount} {totalCount === 1 ? "Rezept" : "Rezepte"}
          </span>
        </div>

        {recipes.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-300 p-6 text-center dark:border-neutral-700">
            <p className="font-medium">Keine passenden Rezepte gefunden</p>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              Passe Suchbegriff oder Filter an und versuche es erneut.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {recipes.map((recipe: RecipeListItem) => {
              return <RecipeArticle key={recipe.id} recipe={recipe} />;
            })}
          </div>
        )}
      </section>

      <MealPlanBanner className="mt-10" />
    </main>
  );
}
