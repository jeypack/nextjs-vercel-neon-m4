"use client";

import Link from "next/link";
import {Sparkles, ArrowRight} from "lucide-react";

export default function CookingHero() {
  return (
    <Link
      href="/cook"
      className="group flex flex-col justify-between gap-5 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 transition hover:border-emerald-400 sm:flex-row sm:items-center sm:p-7 dark:border-emerald-900 dark:bg-emerald-950/30 dark:hover:border-emerald-700"
    >
      <div className="flex items-start gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300">
          <Sparkles size={24} aria-hidden="true" />
        </div>

        <div>
          <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
            Weniger Lebensmittel verschwenden
          </p>
          <h2 className="mt-1 text-xl font-bold text-neutral-950 dark:text-neutral-50">
            Was steckt noch im Kühlschrank?
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-600 dark:text-neutral-400">
            Gib deine verfügbaren Zutaten ein und finde heraus, welche Gerichte
            du damit zubereiten kannst.
          </p>
        </div>
      </div>

      <span className="inline-flex shrink-0 items-center gap-2 self-start text-sm font-semibold text-emerald-800 sm:self-center dark:text-emerald-300">
        Zutaten eingeben
        <ArrowRight
          size={18}
          aria-hidden="true"
          className="transition-transform group-hover:translate-x-1"
        />
      </span>
    </Link>
  );
}
