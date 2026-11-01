import {ClipboardList, ArrowRight} from "lucide-react";
import Link from "next/link";

export default function MealPlanBanner({className}: {className?: string}) {
  const randomBoolean = Math.random() < 0.5;
  return (
    <section
      className={`rounded-xl border border-neutral-200 p-5 sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-6 dark:border-neutral-800 ${className || ""}`}
    >
      <div className="flex items-start gap-4">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
          <ClipboardList size={22} aria-hidden="true" />
        </div>
        {randomBoolean ? (
          <div>
            <h2 className="font-semibold text-neutral-950 dark:text-white">
              Schon für die Woche geplant?
            </h2>
            <p className="mt-1 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
              Plane deine Mahlzeiten und leite daraus deine Einkaufsliste ab.
            </p>
          </div>
        ) : (
          <div>
            <h2 className="font-semibold text-neutral-950 dark:text-white">
              Schon deinen Wochenplan vorbereitet?
            </h2>
            <p className="mt-1 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
              Plane deine Lieblingsgerichte für die kommende Woche.
            </p>
          </div>
        )}
      </div>

      <Link
        href="/meal-plan"
        className="mt-4 inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-emerald-800 hover:text-emerald-900 sm:mt-0 dark:text-emerald-300 dark:hover:text-emerald-200"
      >
        Wochenplan öffnen
        <ArrowRight size={17} aria-hidden="true" />
      </Link>
    </section>
  );
}
