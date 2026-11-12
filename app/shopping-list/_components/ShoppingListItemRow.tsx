"use client";

import {useActionState} from "react";
import {CheckCircle2, RotateCcw, PackagePlus, X} from "lucide-react";
import {secondaryButton, softCardClass, panelClass} from "@/app/_lib/tailwind";
import {
  deleteShoppingItemFromList,
  toggleShoppingItemBought,
  transferBoughtShoppingItemsToPantry,
} from "@/app/shopping-list/_lib/actions";
import type {
  ShoppingListFormState,
  ShoppingListItem,
} from "@/app/shopping-list/_lib/types";

const initialState: ShoppingListFormState = {};

type ShoppingListItemRowProps = {
  item: ShoppingListItem;
};
/* 
function MessageText({state}: {state: ShoppingListFormState}) {
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
 */
export default function ShoppingListItemRow({item}: ShoppingListItemRowProps) {
  const [state, formAction, pending] = useActionState(
    toggleShoppingItemBought,
    initialState,
  );

  const transferAction = async (formData: FormData): Promise<void> => {
    await transferBoughtShoppingItemsToPantry(initialState, formData);
  };

  const deleteAction = async (formData: FormData): Promise<void> => {
    await deleteShoppingItemFromList(initialState, formData);
  };

  const amountLabel =
    item.amount === null
      ? item.unitSymbol
      : `${item.amount} ${item.unitSymbol}`;
  //"rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900"

  return (
    <li className={panelClass + " p-4 sm:p-5"}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="gap-2 flex items-center justify-between sm:flex-col sm:gap-0 sm:justify-start sm:items-start">
          <h3
            className={`text-lg font-semibold ${
              item.isBought
                ? "text-neutral-500 line-through dark:text-neutral-400"
                : "text-neutral-900 dark:text-white"
            }`}
          >
            {item.ingredientName}
          </h3>
          <div className="w-fit sm:mt-2 flex flex-wrap items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
            <span className={`${softCardClass} px-2.5 py-1`}>
              {amountLabel}
            </span>
            <span
              className={
                item.isBought
                  ? "text-emerald-700 dark:text-emerald-400"
                  : "text-amber-700 dark:text-amber-400"
              }
            >
              {item.isBought ? "Gekauft" : "Offen"}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2">
          {item.isBought ? (
            <form action={transferAction}>
              <input type="hidden" name="id" value={item.id} />
              <button
                type="submit"
                className={secondaryButton}
                aria-label="Gekauften Artikel in den Vorrat übernehmen"
                title="In Vorrat übernehmen"
              >
                <span className="inline-flex items-center gap-1.5">
                  <PackagePlus size={14} aria-hidden="true" />
                  In Vorrat übernehmen
                </span>
              </button>
            </form>
          ) : null}

          <form action={formAction} className="space-y-2">
            <input type="hidden" name="id" value={item.id} />
            <input
              type="hidden"
              name="isBought"
              value={item.isBought ? "false" : "true"}
            />
            <button
              type="submit"
              className={secondaryButton}
              disabled={pending}
              aria-label={
                item.isBought ? "Als offen markieren" : "Als gekauft markieren"
              }
            >
              <span className="inline-flex items-center gap-1.5">
                {item.isBought ? (
                  <>
                    <RotateCcw size={14} aria-hidden="true" />
                    {/* {pending ? "Setzt zurück …" : "Wieder offen"} */}
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={14} aria-hidden="true" />
                    {pending ? "Markiert …" : "Als gekauft markieren"}
                  </>
                )}
              </span>
            </button>
            {/* {state.message ? (
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
            ) : null} */}
          </form>

          <form action={deleteAction}>
            <input type="hidden" name="id" value={item.id} />
            <button
              type="submit"
              className={secondaryButton + " h-9"}
              aria-label="Gekauften Artikel löschen"
              title="Löschen"
            >
              <X size={14} aria-hidden="true" />
            </button>
          </form>
        </div>
      </div>
    </li>
  );
}
