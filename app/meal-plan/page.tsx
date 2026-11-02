import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CalendarRange,
  ChefHat,
  Lock,
} from "lucide-react";
import Chip from "@/app/_components/Chip";
import {getCurrentUser} from "@/lib/auth/session";
import type {MealType} from "@/lib/generated/prisma/client";
import MealPlanSlotCard from "@/app/meal-plan/_components/MealPlanSlotCard";
import {
  getMealPlanRecipeOptions,
  getMealPlanWeekEntries,
} from "@/app/meal-plan/_lib/queries";

export const metadata = {
  title: "Meal Plan",
  description: "Plane deine Mahlzeiten für die Woche",
};

const mealTypes: Array<{key: MealType; title: string; description: string}> = [
  {key: "BREAKFAST", title: "Frühstück", description: "Guten Start in den Tag"},
  {key: "LUNCH", title: "Mittagessen", description: "Die Mahlzeit für den Tag"},
  {key: "DINNER", title: "Abendessen", description: "Entspannt den Tag ausklingen lassen"},
];
const DEFAULT_VISIBLE_DAY_COUNT = 4;

function parseAnchorDate(value: string | string[] | undefined): Date {
  const candidate = Array.isArray(value) ? value[0] : value;

  if (candidate) {
    const [year, month, day] = candidate.split("-").map(Number);
    if (year && month && day) {
      const parsed = new Date(year, month - 1, day);
      parsed.setHours(0, 0, 0, 0);
      return parsed;
    }
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function parseVisibleDayCount(value: string | string[] | undefined): number {
  const candidate = Array.isArray(value) ? value[0] : value;
  const parsed = Number(candidate);

  if (!Number.isInteger(parsed)) {
    return DEFAULT_VISIBLE_DAY_COUNT;
  }

  return Math.min(Math.max(parsed, 1), 14);
}

function addDays(date: Date, offset: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + offset);
  return next;
}

function formatDateForQuery(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatRangeLabel(startDate: Date, endDate: Date) {
  const start = new Intl.DateTimeFormat("de-DE", {
    day: "numeric",
    month: "short",
  }).format(startDate);
  const end = new Intl.DateTimeFormat("de-DE", {
    day: "numeric",
    month: "short",
  }).format(endDate);

  return `${start} – ${end}`;
}

function getMinutesSinceMidnight(date: Date) {
  return date.getHours() * 60 + date.getMinutes();
}

function getMealCutoffInMinutes(mealType: MealType) {
  if (mealType === "BREAKFAST") {
    return 11 * 60 + 30;
  }

  if (mealType === "LUNCH") {
    return 17 * 60 + 30;
  }

  return 24 * 60;
}

function shouldSlotBeOpenByDefault(
  slotDate: Date,
  mealType: MealType,
  now: Date,
) {
  const slotKey = formatDateForQuery(slotDate);
  const nowKey = formatDateForQuery(now);

  if (slotKey > nowKey) {
    return true;
  }

  if (slotKey < nowKey) {
    return false;
  }

  return getMinutesSinceMidnight(now) < getMealCutoffInMinutes(mealType);
}

export default async function MealPlanPage({
  searchParams,
}: {
  searchParams: Promise<{[key: string]: string | string[] | undefined}>;
}) {
  const user = await getCurrentUser();
  const resolvedSearchParams = await searchParams;
  const anchorDate = parseAnchorDate(
    resolvedSearchParams.anchorDate ?? resolvedSearchParams.weekStart,
  );
  const visibleDayCount = parseVisibleDayCount(resolvedSearchParams.days);
  //const daysBeforeAnchor = Math.floor((visibleDayCount - 1) / 2);
  //const daysFromAnchor = visibleDayCount - daysBeforeAnchor;
  const rangeStart = anchorDate;
  const rangeEnd = addDays(anchorDate, visibleDayCount - 1);
  /* const rangeStart = addDays(anchorDate, -daysBeforeAnchor);
  const rangeEnd = addDays(anchorDate, daysFromAnchor - 1); */

  let mealEntries: Awaited<ReturnType<typeof getMealPlanWeekEntries>> = [];
  let recipeOptions: Awaited<ReturnType<typeof getMealPlanRecipeOptions>> = [];

  if (user) {
    [mealEntries, recipeOptions] = await Promise.all([
      getMealPlanWeekEntries(user.id, rangeStart, rangeEnd),
      getMealPlanRecipeOptions(user.id, user.role === "ADMIN"),
    ]);
  }

  const mealMap = new Map(
    mealEntries.map((entry) => [
      `${formatDateForQuery(entry.date)}:${entry.mealType}`,
      entry,
    ]),
  );

  const visibleDays = Array.from({length: visibleDayCount}, (_, index) => {
    const current = addDays(rangeStart, index);
    return {
      date: current,
      isoKey: formatDateForQuery(current),
      isToday: formatDateForQuery(current) === formatDateForQuery(new Date()),
    };
  });
  const now = new Date();

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:py-16">
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
            Zeigt einen Zeitraum ab heute mit allen Mahlzeiten auf einen
            Blick – von Frühstück bis Abendessen.
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

      <section className="mb-8 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 sm:p-7 dark:border-emerald-900 dark:bg-emerald-950/30">
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300">
            <ChefHat size={24} aria-hidden="true" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-neutral-950 dark:text-neutral-50">
              {visibleDayCount} Tage voller guter Ideen
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600 dark:text-neutral-400">
              Wähle Rezepte aus deiner Sammlung und ordne sie den passenden
              Tagen und Mahlzeiten zu. Die Einträge werden dir später auch in
              der Einkaufsliste weiterhelfen.
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

      {!user ? (
        <section className="rounded-2xl border border-dashed border-neutral-300 bg-white p-8 text-center dark:border-neutral-700 dark:bg-neutral-900">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
            <Lock size={22} aria-hidden="true" />
          </div>

          <h2 className="mt-4 text-xl font-bold text-neutral-950 dark:text-neutral-50">
            Melde dich an, um deinen Plan zu sehen
          </h2>

          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            Dein persönlicher Wochenplan wird erst nach der Anmeldung geladen.
          </p>

          <Link
            href="/user"
            className="mt-5 inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Anmelden
          </Link>
        </section>
      ) : (
        <section className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {visibleDays.map(({date, isoKey, isToday}) => (
            <article
              key={isoKey}
              className="rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
            >
              <header
                className={`mb-3 rounded-xl px-3 py-2 text-left ${
                  isToday
                    ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-200"
                    : "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                }`}
              >
                <div className="text-[0.7rem] font-semibold uppercase tracking-[0.08em]">
                  {new Intl.DateTimeFormat("de-DE", {weekday: "short"}).format(
                    date,
                  )}
                </div>
                <div className="mt-1 text-lg font-bold leading-none">
                  {new Intl.DateTimeFormat("de-DE", {day: "numeric"}).format(date)}
                </div>
              </header>

              <div className="space-y-3">
                {mealTypes.map((meal) => {
                  const entry = mealMap.get(`${isoKey}:${meal.key}`);

                  return (
                    <MealPlanSlotCard
                      key={`${isoKey}-${meal.key}`}
                      slotDate={isoKey}
                      mealType={meal.key}
                      mealTitle={meal.title}
                      mealDescription={meal.description}
                      entry={entry ?? null}
                      recipeOptions={recipeOptions}
                      defaultOpen={shouldSlotBeOpenByDefault(
                        date,
                        meal.key,
                        now,
                      )}
                    />
                  );
                })}
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
