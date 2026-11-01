"use client";
import Link from "next/link";
import {ShoppingBasket, ArrowRight} from "lucide-react";

export default function MealPlanHero() {
  return (
    <Link
      href="/meal-plan"
      className="group flex items-start gap-4 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 transition hover:border-emerald-400 sm:flex-row sm:items-center sm:p-7 dark:border-emerald-900 dark:bg-emerald-950/30 dark:hover:border-emerald-700"
    >
      <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300">
        <ShoppingBasket size={25} aria-hidden="true" />
      </div>

      <div>
        <h2 className="text-lg font-bold text-neutral-950 dark:text-neutral-50">
          Nur kaufen, was wirklich fehlt
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600 dark:text-neutral-400">
          Erzeuge fehlende Zutaten direkt aus deinem Meal-Plan ab heute.
          Doppelte Zutaten werden pro Einheit zusammengefasst und Vorräte
          berücksichtigt.
        </p>
      </div>
      <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 hover:text-emerald-900 dark:text-emerald-300 dark:hover:text-emerald-200">
        Zum Wochenplan
        <ArrowRight
          size={17}
          aria-hidden="true"
          className="transition-transform group-hover:translate-x-1"
        />
      </div>
    </Link>
  );
}
