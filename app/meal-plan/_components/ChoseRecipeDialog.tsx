import {createMealPlanEntry} from "@/app/meal-plan/_lib/actions";
import {useActionState} from "react";
import RecipeSearchCombobox from "@/app/recipes/_components/RecipeSearchCombobox";
import {emeraldButton} from "@/app/_lib/tailwind";
import type {MealPlanFormState} from "@/app/meal-plan/_lib/types";

function MessageText({state}: {state: MealPlanFormState}) {
  if (!state.message) {
    return null;
  }

  return (
    <p
      className={
        state.success
          ? "text-xs text-emerald-700 dark:text-emerald-400"
          : "text-xs text-red-600 dark:text-red-400"
      }
      role="status"
    >
      {state.message}
    </p>
  );
}

function FieldErrors({messages}: {messages?: string[]}) {
  if (!messages?.length) {
    return null;
  }

  return (
    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
      {messages.join(", ")}
    </p>
  );
}

const initialState: MealPlanFormState = {};

interface ChoseRecipeDialogProps {
  slotDate: string;
  mealType: string;
  recipeOptions: any[];
  onCancel: () => void;
}

export default function ChoseRecipeDialog({
  slotDate,
  mealType,
  recipeOptions,
  onCancel,
}: ChoseRecipeDialogProps) {
  const [createState, createAction, createPending] = useActionState(
    createMealPlanEntry,
    initialState,
  );
  const isBusy = createPending;

  return (
    <div className="p-8">
      <form action={createAction} onSubmit={onCancel} className="space-y-2">
        <input type="hidden" name="date" value={slotDate} />
        <input type="hidden" name="mealType" value={mealType} />
        <RecipeSearchCombobox
          name="recipeId"
          recipes={recipeOptions}
          showDetail={false}
        />
        <FieldErrors messages={createState.errors?.recipeId} />
        <button
          type="submit"
          className={emeraldButton + " mt-4"}
          disabled={isBusy}
        >
          {createPending ? "Plant …" : "Einplanen"}
        </button>
        <MessageText state={createState} />
      </form>
    </div>
  );
}
