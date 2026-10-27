//import GeminiTest from "@/app/cook/_components/AIRecipe";

export const metadata = {
  title: "Rezepte",
  description: "Finde Rezepte basierend auf den Zutaten, die du bereits hast",
};

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  ChefHat,
  Clock3,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkles,
  Users,
} from "lucide-react";

const categories = [
  "Alle",
  "Vegetarisch",
  "Vegan",
  "Pasta",
  "Suppen & Eintöpfe",
  "Ofengerichte",
];

const recipes = [
  {
    title: "Shakshuka",
    description:
      "Würzige Tomatensauce mit Paprika und pochierten Eiern.",
    category: "Vegetarisch",
    time: 30,
    servings: 2,
    difficulty: "Einfach",
  },
  {
    title: "Chili sin Carne",
    description:
      "Herzhafter Eintopf mit Bohnen, Mais und Paprika.",
    category: "Vegan",
    time: 40,
    servings: 4,
    difficulty: "Einfach",
  },
  {
    title: "Thailändisches Kichererbsen-Curry",
    description:
      "Cremige Kokosmilch, rote Currypaste und frischer Spinat.",
    category: "Vegan",
    time: 25,
    servings: 2,
    difficulty: "Einfach",
  },
  {
    title: "Spaghetti Carbonara",
    description:
      "Ein italienischer Klassiker mit cremiger Ei-Käse-Sauce.",
    category: "Pasta",
    time: 25,
    servings: 2,
    difficulty: "Mittel",
  },
  {
    title: "Pilzrisotto",
    description:
      "Cremiger Risotto mit aromatischen Pilzen und Parmesan.",
    category: "Vegetarisch",
    time: 35,
    servings: 2,
    difficulty: "Mittel",
  },
  {
    title: "Kürbis-Ziegenkäse-Quiche",
    description:
      "Herzhafte Quiche mit Kürbis und würzigem Ziegenkäse.",
    category: "Ofengerichte",
    time: 55,
    servings: 4,
    difficulty: "Mittel",
  },
];

export default function RecipesPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-400">
            <BookOpen className="size-4" />
            Deine Rezeptsammlung
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-neutral-950 dark:text-white sm:text-4xl">
            Rezepte entdecken
          </h1>

          <p className="mt-3 max-w-2xl text-neutral-600 dark:text-neutral-400">
            Finde dein nächstes Lieblingsgericht oder lass dich
            von deinen Vorräten inspirieren.
          </p>
        </div>

        <Link
          href="/recipes/new"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
        >
          <Plus className="size-4" />
          Rezept erstellen
        </Link>
      </div>

      {/* Cook feature */}
      <section className="relative mt-8 overflow-hidden rounded-3xl bg-emerald-950 p-6 text-white sm:p-8">
        <div className="relative z-10 max-w-2xl">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-emerald-300">
            <Sparkles className="size-4" />
            Clever kochen statt wegwerfen
          </div>

          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Was steckt noch in deinem Kühlschrank?
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-6 text-emerald-100/80 sm:text-base">
            Gib deine vorhandenen Zutaten ein und entdecke
            passende Gerichte – inklusive fehlender Zutaten.
          </p>

          <Link
            href="/cook"
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-50"
          >
            Rezepte aus Resten finden
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <ChefHat
          aria-hidden="true"
          className="absolute -bottom-8 -right-5 size-44 text-emerald-800/50 sm:right-8 sm:size-56"
        />
      </section>

      {/* Search */}
      <section className="mt-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <label className="relative block flex-1">
            <span className="sr-only">Rezepte durchsuchen</span>
            <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-neutral-400" />
            <input
              type="search"
              placeholder="Rezept oder Zutat suchen …"
              className="min-h-12 w-full rounded-xl border border-neutral-200 bg-white pl-12 pr-4 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
            />
          </label>

          <button
            type="button"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-neutral-200 px-4 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-900"
          >
            <SlidersHorizontal className="size-4" />
            Filter
          </button>
        </div>

        <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
          {categories.map((category, index) => (
            <button
              key={category}
              type="button"
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                index === 0
                  ? "bg-emerald-600 text-white"
                  : "border border-neutral-200 text-neutral-600 hover:border-emerald-600 hover:text-emerald-700 dark:border-neutral-800 dark:text-neutral-300 dark:hover:text-emerald-400"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Recipe list */}
      <section className="mt-8">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-neutral-950 dark:text-white">
              Alle Rezepte
            </h2>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              Eine Auswahl aus deiner Rezeptsammlung
            </p>
          </div>

          <span className="shrink-0 text-sm text-neutral-500 dark:text-neutral-400">
            {recipes.length} Rezepte
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {recipes.map((recipe) => (
            <article
              key={recipe.title}
              className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-5 transition hover:border-emerald-300 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-emerald-900"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {recipe.category}
                </span>

                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  {recipe.difficulty}
                </span>
              </div>

              <h3 className="mt-5 text-lg font-bold text-neutral-950 dark:text-white">
                {recipe.title}
              </h3>

              <p className="mt-2 min-h-12 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                {recipe.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t border-neutral-100 pt-4 text-sm text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 className="size-4" />
                  {recipe.time} Min.
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Users className="size-4" />
                  {recipe.servings} Portionen
                </span>
              </div>

              <div className="mt-5">
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                  Rezept ansehen
                  <ArrowRight className="size-4" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="mt-10 flex flex-col gap-4 rounded-2xl border border-neutral-200 p-6 sm:flex-row sm:items-center sm:justify-between dark:border-neutral-800">
        <div>
          <h2 className="font-semibold text-neutral-950 dark:text-white">
            Schon deinen Wochenplan vorbereitet?
          </h2>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            Plane deine Lieblingsgerichte für die kommende Woche.
          </p>
        </div>

        <Link
          href="/meal-plan"
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-neutral-200 px-4 py-3 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-900"
        >
          Zum Wochenplan
          <ArrowRight className="size-4" />
        </Link>
      </section>
      {/*  <GeminiTest /> */}
    </main>
  );
}
