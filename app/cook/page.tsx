
import IngredientInput from "@/app/cook/_components/IngredientInput";
import {getIngredientNames} from "@/app/cook/_lib/queries";

export default async function CookPage() {
  const ingredientNames = await getIngredientNames();

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <section className="mb-8 max-w-2xl">
        <p className="mb-2 text-sm font-semibold tracking-[0.2em] text-emerald-700 dark:text-emerald-400">
          Meal Planner
        </p>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Kochen mit Resten
        </h1>

        <p className="mt-3 text-base leading-7 text-neutral-600 dark:text-neutral-400">
          Was ist noch im Kühlschrank oder Vorratsschrank?
          Wähle deine Zutaten aus und entdecke Rezepte, für die
          du möglichst wenig zusätzlich einkaufen musst.
        </p>
      </section>

      <IngredientInput ingredientNames={ingredientNames} />
    </main>
  );
}
