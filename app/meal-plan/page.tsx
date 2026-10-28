import Link from "next/link";
import {ArrowRight, CalendarDays, ChefHat, ClipboardList} from "lucide-react";
import Chip from "@/app/_components/Chip";

export const metadata = {
  title: "Meal Plan",
  description: "Plane deine Mahlzeiten für die Woche",
};

const mealTypes = [
  {title: "Frühstück", time: "Guten Start in den Tag"},
  {title: "Mittagessen", time: "Die Mahlzeit für den Tag"},
  {title: "Abendessen", time: "Entspannt den Tag ausklingen lassen"},
];

export default function MealPlanPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:py-16">
      <section className="mb-8">
        <Chip>
          <CalendarDays size={16} aria-hidden="true" />
          Mahlzeiten planen
        </Chip>
        {/* <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300">
          <CalendarDays size={16} aria-hidden="true" />
          Mahlzeiten planen
        </div> */}

        <h1 className="text-3xl font-bold tracking-tight text-neutral-950 dark:text-neutral-50 sm:text-4xl">
          Dein Wochenplan
        </h1>

        <p className="mt-3 max-w-2xl text-base leading-7 text-neutral-600 dark:text-neutral-400">
          Plane deine Mahlzeiten im Voraus, behalte den Überblick und entscheide
          schon heute, was morgen auf den Tisch kommt.
        </p>
      </section>

      <section className="mb-8 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 sm:p-7 dark:border-emerald-900 dark:bg-emerald-950/30">
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300">
            <ChefHat size={25} aria-hidden="true" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-neutral-950 dark:text-neutral-50">
              Eine Woche voller guter Ideen
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600 dark:text-neutral-400">
              Wähle Rezepte aus deiner Sammlung und ordne sie den passenden
              Tagen und Mahlzeiten zu. Deine Planung hilft dir später auch bei
              der Einkaufsliste.
            </p>

            <Link
              href="/recipes"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 hover:text-emerald-900 dark:text-emerald-300 dark:hover:text-emerald-200"
            >
              Rezepte entdecken
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-5">
          <h2 className="text-xl font-bold text-neutral-950 dark:text-neutral-50">
            Deine Mahlzeiten
          </h2>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            Hier entsteht deine persönliche Wochenübersicht.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {mealTypes.map((meal) => (
            <article
              key={meal.title}
              className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
            >
              <h3 className="font-semibold text-neutral-950 dark:text-neutral-50">
                {meal.title}
              </h3>

              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                {meal.time}
              </p>

              <div className="mt-5 flex min-h-24 flex-col items-center justify-center rounded-lg border border-dashed border-neutral-300 px-4 py-5 text-center dark:border-neutral-700">
                <CalendarDays
                  size={23}
                  className="text-neutral-400"
                  aria-hidden="true"
                />
                <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                  Noch keine Mahlzeiten geplant
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-xl border border-neutral-200 bg-white p-5 sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-6 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-start gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
            <ClipboardList size={22} aria-hidden="true" />
          </div>

          <div>
            <h2 className="font-semibold text-neutral-950 dark:text-neutral-50">
              Alles für deinen Einkauf
            </h2>
            <p className="mt-1 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
              Aus deinen geplanten Mahlzeiten soll später eine Einkaufsliste mit
              den noch fehlenden Zutaten entstehen.
            </p>
          </div>
        </div>

        <Link
          href="/shopping-list"
          className="mt-4 inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-emerald-800 hover:text-emerald-900 sm:mt-0 dark:text-emerald-300 dark:hover:text-emerald-200"
        >
          Einkaufsliste öffnen
          <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </section>
    </main>
  );
}
