import Link from "next/link";
import {BookOpen, Lock, Plus} from "lucide-react";
import Chip from "@/app/_components/Chip";
import RecipeCreateForm from "@/app/recipes/new/_components/RecipeCreateForm";
import {getCurrentUser} from "@/lib/auth/session";
import {
  getIngredientNamesForRecipes,
  getRecipeCreateCategoryOptions,
  getUnitNamesForRecipes,
} from "@/app/recipes/_lib/queries";
import {panelClass, primaryButton} from "@/app/_lib/tailwind";
import LoginButton from "@/app/user/_components/LoginButton";

export const metadata = {
  title: "Rezept erstellen",
  description: "Lege ein neues Rezept mit Zutaten und Anleitung an",
};

export default async function RecipeCreatePage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <main className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:py-16">
        <section className="mb-8">
          <Chip>
            <BookOpen className="size-4" />
            Rezepte
          </Chip>
        </section>

        <section className={`${panelClass} p-6 sm:p-8`}>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
            Rezept erstellen
          </h1>
          <p className="mt-3 max-w-2xl text-base text-neutral-600 dark:text-neutral-300">
            Melde dich an, um eigene Rezepte mit Zutaten und Anleitung zu
            speichern.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <LoginButton />
            {/* <Link href="/user" className={primaryButton}>
              <span className="inline-flex items-center gap-2">
                <Lock className="size-4" />
                Zum Login
              </span>
            </Link> */}
            <Link
              href="/recipes"
              className="inline-flex items-center rounded-lg border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-800 transition hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-800"
            >
              Zur Rezeptübersicht
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const [categories, ingredientNames, unitNames] = await Promise.all([
    getRecipeCreateCategoryOptions(),
    getIngredientNamesForRecipes(),
    getUnitNamesForRecipes(),
  ]);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:py-16">
      <section className="mb-6">
        <Chip>
          <Plus className="size-4" />
          Neues Rezept
        </Chip>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
          Rezept erstellen
        </h1>
        <p className="mt-3 max-w-2xl text-base text-neutral-600 dark:text-neutral-300">
          Erfasse die wichtigsten Rezeptdaten und füge alle Zutatenzeilen hinzu.
        </p>
      </section>

      <section className={`${panelClass} p-4 sm:p-6`}>
        <RecipeCreateForm
          categories={categories}
          ingredientNames={ingredientNames}
          unitNames={unitNames}
        />
      </section>
    </main>
  );
}
