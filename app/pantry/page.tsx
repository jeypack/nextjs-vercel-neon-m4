import NoUserHero from "@/app/_components/NoUserHero";
import Chip from "@/app/_components/Chip";
import PantryCreateForm from "@/app/pantry/_components/PantryCreateForm";
import PantryList from "@/app/pantry/_components/PantryList";
import {
  getIngredientNames,
  getPantryItemsForUser,
} from "@/app/pantry/_lib/queries";
import {getCurrentUser} from "@/lib/auth/session";
import {BookOpen} from "lucide-react";

export const metadata = {
  title: "Vorrat",
  description: "Deine persönlichen Lebensmittel im Vorrat",
};

export default async function PantryPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:py-16">
        <section className="mb-8">
          <Chip>
            <BookOpen className="size-4" />
            Vorrat
          </Chip>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-950 dark:text-neutral-50 sm:text-4xl">
            Dein persönlicher Vorrat
          </h1>
          {/* <p className="mt-3 max-w-2xl text-base leading-7 text-neutral-600 dark:text-neutral-400">
            Melde dich an, um nur deinen eigenen Bestand zu sehen und die
            nächsten Mahlzeiten besser zu planen.
          </p> */}
        </section>
        <NoUserHero text="Der Vorrat ist benutzerbezogen und zeigt nur deine eigenen Lebensmittel an." />
      </main>
    );
  }

  const [pantryItems, ingredientNames] = await Promise.all([
    getPantryItemsForUser(user.id),
    getIngredientNames(),
  ]);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:py-16">
      <section className="mb-0">
        <Chip>
          <BookOpen className="size-4" />
          Deine Vorratsliste
        </Chip>
      </section>

      <div className="space-y-6">
        <PantryCreateForm ingredientNames={ingredientNames} />
        <PantryList items={pantryItems} />
      </div>
    </main>
  );
}
