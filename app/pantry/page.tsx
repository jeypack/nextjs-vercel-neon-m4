import Link from "next/link";
import PantryList from "@/app/pantry/_components/PantryList";
import {getPantryItemsForUser} from "@/app/pantry/_lib/queries";
import {panelClass, primaryButton} from "@/app/_lib/tailwind";
import {getCurrentUser} from "@/lib/auth/session";

export const metadata = {
  title: "Vorrat",
  description: "Deine persönlichen Lebensmittel im Vorrat",
};

export default async function PantryPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <main className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:py-16">
        <section className={`${panelClass} p-6 sm:p-8`}>
          <p className="mb-2 text-sm font-semibold tracking-[0.2em] text-emerald-700 dark:text-emerald-400">
            Vorrat
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
            Dein persönlicher Vorrat
          </h1>
          <p className="mt-3 max-w-2xl text-base text-neutral-600 dark:text-neutral-300">
            Melde dich an, um nur deinen eigenen Bestand zu sehen und die nächsten Mahlzeiten besser zu planen.
          </p>

          <div className="mt-6">
            <Link href="/user" className={primaryButton}>
              Zum Login
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const pantryItems = await getPantryItemsForUser(user.id);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:py-16">
      <section className="mb-6">
        <p className="mb-2 text-sm font-semibold tracking-[0.2em] text-emerald-700 dark:text-emerald-400">
          Vorrat
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
          Deine Vorratsliste
        </h1>
        <p className="mt-3 max-w-2xl text-base text-neutral-600 dark:text-neutral-300">
          Nur deine eigenen Einträge werden hier angezeigt, sortiert nach dem schnellsten Ablaufdatum.
        </p>
      </section>

      <PantryList items={pantryItems} />
    </main>
  );
}
