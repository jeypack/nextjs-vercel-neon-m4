import type {MealType} from "@/lib/generated/prisma/client";
import type {VisibleDaysSectionProps} from "@/app/meal-plan/_lib/types";
import MealPlanSlotCard from "@/app/meal-plan/_components/MealPlanSlotCard";
import {
  formatDateForQuery,
  getMinutesSinceMidnight,
} from "@/app/meal-plan/_lib/date-utils";

const mealTypes: Array<{key: MealType; title: string; description: string}> = [
  {key: "BREAKFAST", title: "Frühstück", description: "Guten Start in den Tag"},
  {key: "LUNCH", title: "Mittagessen", description: "Die Mahlzeit für den Tag"},
  {
    key: "DINNER",
    title: "Abendessen",
    description: "Entspannt den Tag ausklingen lassen",
  },
];

const now = new Date();

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

export default function VisibleDaysSection({
  visibleDays,
  mealMap,
  recipeOptions,
}: VisibleDaysSectionProps) {
  return (
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
                  defaultOpen={true}
                />
              );
            })}
          </div>
        </article>
      ))}
    </section>
  );
}
/* defaultOpen={shouldSlotBeOpenByDefault(date, meal.key, now)} */