import MealPlanBanner from "@/app/_components/MealPlanBanner";
import Link from "next/link";
import { getPublicRecipesCount } from "@/app/recipes/_lib/queries";
import {
  ArrowRight,
  CalendarDays,
  ChefHat,
  CookingPot,
  Leaf,
  Plus,
  Refrigerator,
  Search,
  ShoppingBasket,
} from "lucide-react";
import CookingHero from "@/app/_components/CookingHero";

export default async function HomePage() {
  const recipesCount = await getPublicRecipesCount();
  const features = [
    {
      title: "Rezepte entdecken",
      description:
        "Rezepte durchsuchen, filtern und eigene Gerichte verwalten.",
      href: "/recipes",
      count: recipesCount,
      icon: CookingPot,
    },
    {
      title: "Mit Vorräten kochen",
      description: "Finde Rezepte, die zu deinen vorhandenen Zutaten passen.",
      href: "/cook",
      icon: ChefHat,
    },
    {
      title: "Vorrat verwalten",
      description: "Behalte deine Zutaten und deren Ablaufdaten im Blick.",
      href: "/pantry",
      icon: Refrigerator,
    },
    {
      title: "Wochenplan",
      description: "Plane Frühstück, Mittag- und Abendessen im Voraus.",
      href: "/meal-plan",
      icon: CalendarDays,
    },
    {
      title: "Einkaufsliste",
      description: "Stelle fehlende Zutaten für deine Gerichte zusammen.",
      href: "/shopping-list",
      icon: ShoppingBasket,
    },
  ];
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:py-16">
      {/* Welcome */}
      <section className="mb-10">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300">
          <Leaf size={16} aria-hidden="true" />
          Bewusst kochen. Weniger verschwenden.
        </div>

        <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-neutral-950 dark:text-neutral-50 sm:text-4xl">
          Was kochen wir heute?
        </h1>

        <p className="mt-3 max-w-2xl text-base leading-7 text-neutral-600 dark:text-neutral-400">
          Entdecke passende Rezepte, verwende deine Vorräte und plane deine
          Mahlzeiten. So machst du aus vorhandenen Zutaten leckere Gerichte.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/recipes"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500"
          >
            <Search size={18} aria-hidden="true" />
            Rezept finden
            <ArrowRight size={16} aria-hidden="true" />
          </Link>

          <Link
            href="/pantry"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-white px-5 py-3 text-sm font-semibold text-neutral-800 transition hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
          >
            <Plus size={18} aria-hidden="true" />
            Vorrat verwalten
          </Link>
        </div>
      </section>

      {/* Leftover cooking */}
      <section className="mb-12">
        <CookingHero />
      </section>

      {/* Main features */}
      <section className="mb-12">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-neutral-950 dark:text-neutral-50">
              Dein Küchenbereich
            </h2>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
              Alles für deine tägliche Küchenplanung.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <Link
                key={feature.href}
                href={feature.href}
                className="group flex min-h-44 flex-col rounded-xl border border-neutral-200 bg-white p-5 transition hover:border-emerald-400 hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-emerald-800"
              >
                <div className="flex items-center justify-between">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
                    <Icon size={21} aria-hidden="true" />
                  </div>
                  {feature.count && (
                    <span className="text-sm text-neutral-500 dark:text-neutral-400">
                      {feature.count} Rezepte
                    </span>
                  )}
                  <ArrowRight
                    size={18}
                    aria-hidden="true"
                    className="text-neutral-400 transition group-hover:translate-x-1 group-hover:text-emerald-700 dark:group-hover:text-emerald-400"
                  />
                </div>

                <h3 className="mt-4 font-semibold text-neutral-950 dark:text-neutral-50">
                  {feature.title}
                </h3>

                <p className="mt-1 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                  {feature.description}
                </p>
              </Link>
            );
          })}

          {/* Create recipe */}
          <Link
            href="/recipes/new"
            className="group flex min-h-44 flex-col justify-center rounded-xl border border-dashed border-neutral-300 p-5 transition hover:border-emerald-500 hover:bg-emerald-50/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 dark:border-neutral-700 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/20"
          >
            <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300">
              <Plus size={22} aria-hidden="true" />
            </div>

            <h3 className="mt-4 font-semibold text-neutral-950 dark:text-neutral-50">
              Eigenes Rezept erstellen
            </h3>

            <p className="mt-1 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
              Halte deine Lieblingsgerichte und Zutaten fest.
            </p>
          </Link>
        </div>
      </section>

      <MealPlanBanner />
    </main>
  );
}
