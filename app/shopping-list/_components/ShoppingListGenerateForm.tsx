"use client";

import {useActionState} from "react";
import {RefreshCw} from "lucide-react";
import {emeraldButton} from "@/app/_lib/tailwind";
import {generateShoppingListFromMealPlan} from "@/app/shopping-list/_lib/actions";
import type {ShoppingListFormState} from "@/app/shopping-list/_lib/types";

const initialState: ShoppingListFormState = {};

export default function ShoppingListGenerateForm() {
  const [state, formAction, pending] = useActionState(
    generateShoppingListFromMealPlan,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-0">
      <button type="submit" className={emeraldButton + " flex justify-center items-center"} disabled={pending}>
        <span className="inline-flex justify-center items-center gap-2">
          <RefreshCw size={16} aria-hidden="true" />
          {pending ? "Erstellt …" : "Fehlende Zutaten aus Meal-Plan erzeugen"}
        </span>
      </button>

      {state.message ? (
        <p
          className={
            state.success
              ? "text-sm text-emerald-700 dark:text-emerald-400"
              : "text-sm text-red-600 dark:text-red-400"
          }
          role="status"
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
