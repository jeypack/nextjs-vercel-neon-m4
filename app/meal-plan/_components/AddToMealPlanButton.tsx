"use client";

import {useModal} from "@/app/_context/ModalContext";
import AddToMealPlanDialog from "@/app/meal-plan/_components/AddToMealPlanDialog";
import type {RecipeDetailItem} from "@/app/recipes/_lib/types";

import {CalendarPlus} from "lucide-react";

export default function AddToMealPlanButton({
  recipe,
}: {
  recipe: RecipeDetailItem;
}) {
  const {open, close} = useModal();

  return (
    <button
      type="button"
      title={"Zum Essensplan hinzufügen"}
      className="cursor-pointer inline-flex items-center justify-start gap-2 text-sm font-semibold text-emerald-700 transition hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 text-left"
      onClick={() => {
        open(
          `${recipe.title} zum Wochenplan hinzufügen`,
          <AddToMealPlanDialog recipeId={recipe.id} onCancel={close} />,
        );
      }}
    >
      <CalendarPlus className="size-4" />
      Zum Wochenplan hinzufügen
    </button>
  );
}
