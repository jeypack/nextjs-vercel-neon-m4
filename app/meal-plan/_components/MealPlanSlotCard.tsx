"use client";

import Link from "next/link";
import {useActionState, useMemo} from "react";
import {Disclosure, DisclosureButton, DisclosurePanel} from "@headlessui/react";
import {ChevronDown, Clock3, Sparkles, Trash2} from "lucide-react";
import ListBox from "@/app/_components/ListBox";
import {dangerButton, emeraldButton} from "@/app/_lib/tailwind";
import {
  createMealPlanEntry,
  deleteMealPlanEntry,
} from "@/app/meal-plan/_lib/actions";
import type {
  MealPlanEntry,
  MealPlanFormState,
  MealPlanRecipeOption,
} from "@/app/meal-plan/_lib/types";
import type {MealType} from "@/lib/generated/prisma/client";

const initialState: MealPlanFormState = {};

type MealPlanSlotCardProps = {
  slotDate: string;
  mealType: MealType;
  mealTitle: string;
  mealDescription: string;
  entry: MealPlanEntry | null;
  recipeOptions: MealPlanRecipeOption[];
  defaultOpen?: boolean;
};

function MessageText({
  state,
}: {
  state: MealPlanFormState;
}) {
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

export default function MealPlanSlotCard({
  slotDate,
  mealType,
  mealTitle,
  mealDescription,
  entry,
  recipeOptions,
  defaultOpen = false,
}: MealPlanSlotCardProps) {
  const [createState, createAction, createPending] = useActionState(
    createMealPlanEntry,
    initialState,
  );
  const [deleteState, deleteAction, deletePending] = useActionState(
    deleteMealPlanEntry,
    initialState,
  );

  const isBusy = createPending || deletePending;
  const recipeSelectOptions = useMemo(
    () => [
      {id: "", name: "Rezept auswählen"},
      ...recipeOptions.map((recipe) => ({
        id: recipe.id,
        name: recipe.isPublic ? `${recipe.title} (öffentlich)` : recipe.title,
      })),
    ],
    [recipeOptions],
  );

  return (
    <Disclosure
      as="div"
      defaultOpen={defaultOpen}
      className="rounded-xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950/40"
    >
      {({open}) => (
        <>
          <DisclosureButton className="flex w-full items-center justify-between gap-3 px-3 py-3 text-left">
            <div>
              <div className="mb-1 flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-neutral-500 dark:text-neutral-400">
                <Clock3 size={12} aria-hidden="true" />
                {mealTitle}
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {mealDescription}
              </p>
            </div>
            <ChevronDown
              size={16}
              className={`shrink-0 text-neutral-500 transition-transform dark:text-neutral-400 ${
                open ? "rotate-180" : ""
              }`}
              aria-hidden="true"
            />
          </DisclosureButton>

          <DisclosurePanel className="space-y-3 px-3 pb-3">
            {entry ? (
              <div className="space-y-3">
                <div className="space-y-2">
                  <Link
                    href={`/recipes/${entry.recipe.id}`}
                    className="block text-sm font-semibold text-emerald-800 hover:text-emerald-900 dark:text-emerald-300 dark:hover:text-emerald-200"
                  >
                    {entry.recipe.title}
                  </Link>
                  {entry.recipe.description ? (
                    <p className="line-clamp-3 text-xs leading-5 text-neutral-600 dark:text-neutral-400">
                      {entry.recipe.description}
                    </p>
                  ) : null}
                </div>

                <form action={deleteAction} className="space-y-2">
                  <input type="hidden" name="id" value={entry.id} />
                  <button type="submit" className={dangerButton} disabled={isBusy}>
                    <span className="inline-flex items-center gap-1.5">
                      <Trash2 size={14} aria-hidden="true" />
                      {deletePending ? "Entfernt …" : "Aus Slot entfernen"}
                    </span>
                  </button>
                  <MessageText state={deleteState} />
                </form>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex min-h-16 flex-col items-center justify-center rounded-lg border border-dashed border-neutral-300 px-3 py-2 text-center dark:border-neutral-700">
                  <Sparkles size={16} className="text-neutral-400" aria-hidden="true" />
                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                    Noch frei
                  </p>
                </div>

                <form action={createAction} className="space-y-2">
                  <input type="hidden" name="date" value={slotDate} />
                  <input type="hidden" name="mealType" value={mealType} />
                  <ListBox
                    data={recipeSelectOptions}
                    label="Rezept"
                    name="recipeId"
                    defaultValue=""
                  />
                  <FieldErrors messages={createState.errors?.recipeId} />
                  <button type="submit" className={emeraldButton} disabled={isBusy}>
                    {createPending ? "Plant …" : "Einplanen"}
                  </button>
                  <MessageText state={createState} />
                </form>
              </div>
            )}
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}
