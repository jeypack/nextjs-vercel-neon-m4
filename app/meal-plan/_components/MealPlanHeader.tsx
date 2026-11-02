import Chip from "@/app/_components/Chip";
import Link from "next/link";
import {ArrowLeft, ArrowRight, CalendarDays, CalendarRange} from "lucide-react";
import {
  addDays,
  formatDateForQuery,
  formatRangeLabel,
} from "@/app/meal-plan/_lib/date-utils";
import type {MealPlanHeaderProps} from "@/app/meal-plan/_lib/types";

export default function MealPlanHeader({
  anchorDate,
  visibleDayCount,
  rangeStart,
  rangeEnd,
}: MealPlanHeaderProps) {
  return (
    <section className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <Chip>
          <CalendarDays size={16} aria-hidden="true" />
          Mahlzeiten planen
        </Chip>

        <h1 className="text-3xl font-bold tracking-tight text-neutral-950 dark:text-neutral-50 sm:text-4xl">
          Dein Wochenplan
        </h1>

        <p className="mt-3 max-w-2xl text-base leading-7 text-neutral-600 dark:text-neutral-400">
          Zeigt einen Zeitraum ab heute mit allen Mahlzeiten auf einen Blick –
          von Frühstück bis Abendessen.
        </p>
      </div>

      <div className="flex items-center gap-2 self-start lg:self-auto">
        <Link
          href={`/meal-plan?anchorDate=${formatDateForQuery(addDays(anchorDate, -visibleDayCount))}&days=${visibleDayCount}`}
          className="inline-flex h-11 items-center justify-center rounded-xl border border-neutral-200 bg-white p-2 text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-200 dark:hover:bg-neutral-900"
          aria-label={`Vorherige ${visibleDayCount} Tage`}
        >
          <ArrowLeft size={16} aria-hidden="true" />
        </Link>

        <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-900 dark:border-emerald-900/80 dark:bg-emerald-950/40 dark:text-emerald-200">
          <CalendarRange size={16} aria-hidden="true" />
          {formatRangeLabel(rangeStart, rangeEnd)}
        </div>

        <Link
          href={`/meal-plan?anchorDate=${formatDateForQuery(addDays(anchorDate, visibleDayCount))}&days=${visibleDayCount}`}
          className="inline-flex h-11 items-center justify-center rounded-xl border border-neutral-200 bg-white p-2 text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-200 dark:hover:bg-neutral-900"
          aria-label={`Nächste ${visibleDayCount} Tage`}
        >
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
