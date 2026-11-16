import Link from "next/link";
import {notFound} from "next/navigation";
import {ArrowLeft, Pencil} from "lucide-react";
import Chip from "@/app/_components/Chip";
import RecipeEditForm from "@/app/recipes/[id]/edit/_components/RecipeEditForm";
import {panelClass} from "@/app/_lib/tailwind";
import {getCurrentUser} from "@/lib/auth/session";
import {
  getIngredientNamesForRecipes,
  getRecipeCreateCategoryOptions,
  getRecipeForEditor,
  getUnitNamesForRecipes,
} from "@/app/recipes/_lib/queries";

export const metadata = {
  title: "Rezept bearbeiten",
  description: "Bearbeite oder lösche ein bestehendes Rezept",
};

export default async function RecipeEditPage({
  params,
}: {
  params: Promise<{id: string}>;
}) {
  const user = await getCurrentUser();

  if (!user) {
    notFound();
  }

  const resolvedParams = await params;
  const recipeId = Number(resolvedParams.id);

  if (!Number.isInteger(recipeId) || recipeId <= 0) {
    notFound();
  }

  const recipe = await getRecipeForEditor(
    recipeId,
    user.id,
    user.role === "ADMIN",
  );

  if (!recipe) {
    notFound();
  }

  const [categories, ingredientNames, unitNames] = await Promise.all([
    getRecipeCreateCategoryOptions(),
    getIngredientNamesForRecipes(),
    getUnitNamesForRecipes(),
  ]);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:py-16">
      <div className="mb-6 space-y-4">
        <Link
          href={`/recipes/${recipe.id}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 transition hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
          scroll={false}
        >
          <ArrowLeft className="size-4" />
          Zurück zur Rezeptansicht
        </Link>

        <section>
          {/* <Chip>
            <Pencil className="size-4" />
            Rezept bearbeiten
          </Chip> */}
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
            {recipe.title}
          </h1>
          <p className="mt-3 max-w-2xl text-base text-neutral-600 dark:text-neutral-300">
            Passe Rezeptdaten, Zutaten und Sichtbarkeit an oder lösche das
            Rezept.
          </p>
        </section>
      </div>

      <section className={`${panelClass} p-4 sm:p-6`}>
        <RecipeEditForm
          recipe={recipe}
          categories={categories}
          ingredientNames={ingredientNames}
          unitNames={unitNames}
        />
      </section>
    </main>
  );
}
