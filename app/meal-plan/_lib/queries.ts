import {prisma} from "@/lib/prisma";
import type {MealPlanEntry, MealPlanRecipeOption} from "@/app/meal-plan/_lib/types";

export async function getMealPlanWeekEntries(
  userId: number,
  weekStart: Date,
  weekEnd: Date,
): Promise<MealPlanEntry[]> {
  return prisma.mealPlan.findMany({
    where: {
      userId,
      date: {
        gte: weekStart,
        lte: weekEnd,
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
