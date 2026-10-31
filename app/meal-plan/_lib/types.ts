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
