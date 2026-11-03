import Link from "next/link";
import {ArrowLeft, ArrowRight, CalendarRange} from "lucide-react";
import {
  addDays,
  formatDateForQuery,
  formatRangeLabel,
} from "@/app/meal-plan/_lib/date-utils";
import type {MealCalendarRangeProps} from "@/app/meal-plan/_lib/types";

export default function MealCalendarRange({
  anchorDate,
  visibleDayCount,
  rangeStart,
  rangeEnd,
}: MealCalendarRangeProps) {
  return (
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
  );
}
