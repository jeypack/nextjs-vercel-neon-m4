import "server-only";
import {prisma} from "@/lib/prisma";
import type {
  MealPlanEntry,
  MealPlanRecipeOption,
} from "@/app/meal-plan/_lib/types";
import {getCurrentUser} from "@/lib/auth/session";
import {parseDateInputToUtcDate, formatUtcDateForQuery} from "@/app/meal-plan/_lib/date-utils";

function normalizeToUtcDateOnly(date: Date): Date {
  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
}

export async function getMealPlanWeekEntries(
  userId: number,
  weekStart: Date,
  weekEnd: Date,
): Promise<MealPlanEntry[]> {
  const normalizedWeekStart = normalizeToUtcDateOnly(weekStart);
  const normalizedWeekEnd = normalizeToUtcDateOnly(weekEnd);

  return prisma.mealPlan.findMany({
    where: {
      userId,
      date: {
        gte: normalizedWeekStart,
        lte: normalizedWeekEnd,
      },
    },
    select: {
      id: true,
      mealType: true,
      date: true,
      recipe: {
        select: {
          id: true,
          title: true,
          description: true,
        },
      },
    },
    orderBy: [{date: "asc"}, {mealType: "asc"}],
  });
}

export async function getMealPlanRecipeOptions(
  userId: number,
  isAdmin: boolean,
): Promise<MealPlanRecipeOption[]> {
  const recipes = await prisma.recipe.findMany({
    where: isAdmin
      ? undefined
      : {
          OR: [{userId}, {isPublic: true}],
        },
    select: {
      id: true,
      title: true,
      isPublic: true,
    },
    orderBy: {
      title: "asc",
    },
  });

  return recipes;
}

export async function getOccupiedMealPlanSlots(
  startDate: string,
  endDate: string,
) {
  const user = await getCurrentUser();

  if (!user) return [];

  const entries = await prisma.mealPlan.findMany({
    where: {
      userId: user.id,
      date: {
        gte: parseDateInputToUtcDate(startDate),
        lt: parseDateInputToUtcDate(endDate),
      },
    },
    select: {
      date: true,
      mealType: true,
    },
  });

  return entries.map((entry) => ({
    date: formatUtcDateForQuery(entry.date),
    mealType: entry.mealType,
  }));
}

/* export async function getOccupiedMealPlanSlots(
  startDate: string,
  endDate: string,
) {
  const user = await getCurrentUser();

  if (!user) {
    return [];
  }

  const entries = await prisma.mealPlan.findMany({
    where: {
      userId: user.id,
      date: {
        gte: parseDateInputToUtcDate(startDate),
        lt: parseDateInputToUtcDate(endDate),
      },
    },
    select: {
      date: true,
      mealType: true,
    },
  });

  return entries.map((entry) => ({
    date: entry.date.toISOString().slice(0, 10),
    mealType: entry.mealType,
  }));
} */
