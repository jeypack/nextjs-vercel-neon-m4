import {Sparkles, ArrowRight, ChefHat} from "lucide-react";
import Link from "next/link";

export default function RecipeHero() {
  return (
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
          Gib deine vorhandenen Zutaten ein und entdecke passende Gerichte –
          inklusive fehlender Zutaten.
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
  );
}
