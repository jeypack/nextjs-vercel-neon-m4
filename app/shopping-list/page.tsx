import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  ShoppingBasket,
} from "lucide-react";
import Chip from "@/app/_components/Chip";

export const metadata = {
  title: "Einkaufsliste",
  description: "Behalte den Überblick über deine benötigten Zutaten",
};

export default function ShoppingListPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="mb-8">
        <Chip>
          <ShoppingBasket size={16} aria-hidden="true" />
          Clever einkaufen
        </Chip>

        <h1 className="text-3xl font-bold tracking-tight text-neutral-950 dark:text-neutral-50 sm:text-4xl">
          Deine Einkaufsliste
        </h1>

        <p className="mt-3 max-w-2xl text-base leading-7 text-neutral-600 dark:text-neutral-400">
          Behalte den Überblick über alles, was du noch brauchst. Plane deinen
          Einkauf passend zu deinen Rezepten und vorhandenen Vorräten.
        </p>
      </section>

      <section className="mb-8 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 sm:p-7 dark:border-emerald-900 dark:bg-emerald-950/30">
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300">
            <ShoppingBasket size={25} aria-hidden="true" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-neutral-950 dark:text-neutral-50">
              Nur kaufen, was wirklich fehlt
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600 dark:text-neutral-400">
              Geplant ist eine Einkaufsliste, die fehlende Zutaten aus deinem
              Wochenplan zusammenstellt und vorhandene Vorräte berücksichtigt.
              Doppelte Zutaten sollen dabei sinnvoll zusammengefasst werden.
            </p>

            <Link
              href="/meal-plan"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 hover:text-emerald-900 dark:text-emerald-300 dark:hover:text-emerald-200"
            >
              Zum Wochenplan
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-5">
          <h2 className="text-xl font-bold text-neutral-950 dark:text-neutral-50">
            Deine Einkaufsliste
          </h2>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            Hier werden später deine benötigten Zutaten angezeigt.
          </p>
        </div>

        <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-white px-5 py-10 text-center dark:border-neutral-700 dark:bg-neutral-900">
          <div className="flex size-14 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
            <ClipboardList size={27} aria-hidden="true" />
          </div>

          <h3 className="mt-4 font-semibold text-neutral-950 dark:text-neutral-50">
            Deine Liste ist noch leer
          </h3>

          <p className="mt-2 max-w-md text-sm leading-6 text-neutral-600 dark:text-neutral-400">
            Plane zuerst deine Mahlzeiten. Anschließend kannst du die benötigten
            Zutaten zusammenstellen und beim Einkauf abhaken.
          </p>

          <Link
            href="/meal-plan"
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500"
          >
            <CheckCircle2 size={17} aria-hidden="true" />
            Wochenplan öffnen
          </Link>
        </div>
      </section>
    </main>
  );
}
