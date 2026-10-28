"use client";

import Link from "next/link";
import {AlertTriangle, RefreshCcw} from "lucide-react";

export default function RecipesError({
  reset,
}: {
  error: Error & {digest?: string};
  reset: () => void;
}) {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
      <section className="rounded-2xl border border-red-200 bg-red-50/70 p-6 dark:border-red-900 dark:bg-red-950/20 sm:p-8">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-300 bg-white px-3 py-1 text-sm font-medium text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
          <AlertTriangle className="size-4" />
          Fehler beim Laden
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-3xl">
          Rezepte konnten nicht geladen werden
        </h1>

        <p className="mt-3 text-sm leading-6 text-neutral-700 dark:text-neutral-300 sm:text-base">
          Bitte versuche es erneut. Wenn der Fehler bestehen bleibt, aktualisiere
          die Seite oder kehre später zurück.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
          >
            <RefreshCcw className="size-4" />
            Erneut versuchen
          </button>

          <Link
            href="/recipes"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-neutral-300 px-4 py-2.5 text-sm font-semibold text-neutral-800 transition hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-800"
          >
            Zur Rezeptübersicht
          </Link>
        </div>
      </section>
    </main>
  );
}
