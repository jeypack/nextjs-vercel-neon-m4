import Link from "next/link";
import {ArrowRight, ChefHat, Lock} from "lucide-react";
import {getCurrentUser} from "@/lib/auth/session";
import VisibleDaysSection from "@/app/meal-plan/_components/VisibleDaysSection";
import MealPlanHeader from "@/app/meal-plan/_components/MealPlanHeader";
import {
  getMealPlanRecipeOptions,
  getMealPlanWeekEntries,
} from "@/app/meal-plan/_lib/queries";
import {
  addDays,
  formatDateForQuery,
  parseAnchorDate,
  parseVisibleDayCount,
} from "@/app/meal-plan/_lib/date-utils";

export const metadata = {
  title: "Meal Plan",
  description: "Plane deine Mahlzeiten für die Woche",
};

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

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:py-16">
      <MealPlanHeader
        anchorDate={anchorDate}
        visibleDayCount={visibleDayCount}
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
      />

      <Banner visibleDayCount={visibleDayCount} />

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
        <VisibleDaysSection
          visibleDays={visibleDays}
          mealMap={mealMap}
          recipeOptions={recipeOptions}
        />
      )}
    </main>
  );
}

function Banner({visibleDayCount}: {visibleDayCount: number}) {
  return (
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
            Wähle Rezepte aus deiner Sammlung und ordne sie den passenden Tagen
            und Mahlzeiten zu. Die Einträge werden dir später auch in der
            Einkaufsliste weiterhelfen.
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
  );
}
