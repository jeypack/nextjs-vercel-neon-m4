import type {MealType} from "@/lib/generated/prisma/client";

export type MealPlanFormState = {
  success?: boolean;
  message?: string;
  errors?: {
    id?: string[];
    date?: string[];
    mealType?: string[];
    recipeId?: string[];
  };
};

export type MealPlanRecipeOption = {
  id: number;
  title: string;
  isPublic: boolean;
};

export type MealPlanEntry = {
  id: number;
  mealType: MealType;
  date: Date;
  recipe: {
    id: number;
    title: string;
    description: string | null;
  };
};

export interface MealCalendarRangeProps {
  anchorDate: Date;
  visibleDayCount: number;
  rangeStart: Date;
  rangeEnd: Date;
}

export type MealPlanSlotCardProps = {
  slotDate: string;
  mealType: MealType;
  mealTitle: string;
  mealDescription: string;
  entry: MealPlanEntry | null;
  recipeOptions: MealPlanRecipeOption[];
  defaultOpen?: boolean;
};

export interface VisibleDaysSectionProps {
  visibleDays: Array<{date: Date; isoKey: string; isToday: boolean}>;
  mealMap: Map<string, any>;
  recipeOptions: any[];
}
