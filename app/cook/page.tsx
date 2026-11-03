import IngredientInput from "@/app/cook/_components/IngredientInput";
import Chip from "@/app/_components/Chip";
import {
  getIngredientNames,
  getPantryIngredientNamesForUser,
} from "@/app/cook/_lib/queries";
import {Leaf} from "lucide-react";
import {getCurrentUser} from "@/lib/auth/session";

export const metadata = {
  title: "Kochen mit Resten",
  description: "Finde Rezepte basierend auf den Zutaten, die du bereits hast",
};

export default async function CookPage() {
  const user = await getCurrentUser();
  
  const ingredientNamesPromise = getIngredientNames();
  const pantryIngredientNamesPromise = user
    ? getPantryIngredientNamesForUser(user.id)
    : Promise.resolve<string[]>([]);

  const [ingredientNames, pantryIngredientNames] = await Promise.all([
    ingredientNamesPromise,
    pantryIngredientNamesPromise,
  ]);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:py-16">
      <section className="mb-8 max-w-2xl">
        <Chip>
          <Leaf size={16} aria-hidden="true" />
          Bewusst kochen. Weniger verschwenden.
        </Chip>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Kochen mit Resten
        </h1>

        <p className="mt-3 text-base leading-7 text-neutral-600 dark:text-neutral-400">
          Was ist noch im Kühlschrank oder Vorratsschrank? Wähle deine Zutaten
          aus und entdecke Rezepte, für die du möglichst wenig zusätzlich
          einkaufen musst.
        </p>
      </section>

      <IngredientInput
        ingredientNames={ingredientNames}
        pantryIngredientNames={pantryIngredientNames}
        userId={user?.id ?? null}
      />
    </main>
  );
}
