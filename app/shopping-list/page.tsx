import Link from "next/link";
import NoUserHero from "@/app/_components/NoUserHero";
import DeleteBoughtItemsButton from "@/app/shopping-list/_components/DeleteBoughtItemsButton";
import {
  EyeOff,
  ClipboardList,
  ShoppingBasket,
  CheckCircle2,
} from "lucide-react";
import Chip from "@/app/_components/Chip";
import {getCurrentUser} from "@/lib/auth/session";
import {secondaryButton} from "@/app/_lib/tailwind";
import ShoppingListGenerateForm from "@/app/shopping-list/_components/ShoppingListGenerateForm";
import ShoppingListItems from "@/app/shopping-list/_components/ShoppingListItems";
import {
  getShoppingListItemsForUser,
  hasBoughtShoppingItemsForUser,
} from "@/app/shopping-list/_lib/queries";
import MealPlanHero from "@/app/_components/MealPlanHero";

export const metadata = {
  title: "Einkaufsliste",
  description: "Behalte den Überblick über deine benötigten Zutaten",
};

function parseHideBought(value: string | string[] | undefined): boolean {
  const candidate = Array.isArray(value) ? value[0] : value;
  return candidate === "1";
}

export default async function ShoppingListPage({
  searchParams,
}: {
  searchParams: Promise<{[key: string]: string | string[] | undefined}>;
}) {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:py-16">
        <section className="mb-8">
          <Chip>
            <ShoppingBasket size={16} aria-hidden="true" />
            Clever einkaufen
          </Chip>

          <h1 className="text-3xl font-bold tracking-tight text-neutral-950 dark:text-neutral-50 sm:text-4xl">
            Deine Einkaufsliste
          </h1>
        </section>

        <NoUserHero
          text="Die Einkaufsliste ist benutzerbezogen und wird aus deinem persönlichen
        Meal-Plan berechnet."
        />
      </main>
    );
  }

  const resolvedSearchParams = await searchParams;
  const hideBought = parseHideBought(resolvedSearchParams.hideBought);
  const [shoppingItems, hasBoughtItems] = await Promise.all([
    getShoppingListItemsForUser(user.id, hideBought),
    hasBoughtShoppingItemsForUser(user.id),
  ]);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:py-16">
      <section className="mb-8">
        {/* <Chip>
          <ShoppingBasket size={16} aria-hidden="true" />
          Clever einkaufen
        </Chip> */}

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950 dark:text-neutral-50">
          Deine Einkaufsliste
        </h1>

       {/*  <p className="mt-3 max-w-2xl text-base leading-7 text-neutral-600 dark:text-neutral-400">
          Behalte den Überblick über alles, was du noch brauchst. Plane deinen
          Einkauf passend zu deinen Rezepten und vorhandenen Vorräten.
        </p> */}
      </section>

      <section>
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <ShoppingListGenerateForm />

            {hasBoughtItems && (
              <>
                <DeleteBoughtItemsButton userId={user.id} />
                <Link
                  href={
                    hideBought
                      ? "/shopping-list"
                      : "/shopping-list?hideBought=1"
                  }
                  className={secondaryButton}
                  aria-label={
                    hideBought
                      ? "Alle Einträge anzeigen"
                      : "Gekaufte ausblenden"
                  }
                >
                  <span className="inline-flex items-center gap-1.5">
                    <EyeOff size={14} aria-hidden="true" />
                    {hideBought ? "Alle anzeigen" : "Gekaufte ausblenden"}
                  </span>
                </Link>
              </>
            )}
          </div>
        </div>

        {shoppingItems.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-white px-5 py-10 text-center dark:border-neutral-700 dark:bg-neutral-900">
            <div className="flex size-14 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
              <ClipboardList size={27} aria-hidden="true" />
            </div>

            <h3 className="mt-4 font-semibold text-neutral-950 dark:text-neutral-50">
              Deine Liste ist aktuell leer
            </h3>

            <p className="mt-2 max-w-md text-sm leading-6 text-neutral-600 dark:text-neutral-400">
              Erzeuge jetzt fehlende Zutaten aus deinem Meal-Plan oder plane
              zuerst weitere Mahlzeiten.
            </p>

            <Link
              href="/meal-plan"
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500"
            >
              <CheckCircle2 size={17} aria-hidden="true" />
              Wochenplan öffnen
            </Link>
          </div>
        ) : (
          <ShoppingListItems items={shoppingItems} hideBought={hideBought} />
        )}
      </section>
      {!user && (
        <section className="mt-8">
          <MealPlanHero />
        </section>
      )}
    </main>
  );
}
