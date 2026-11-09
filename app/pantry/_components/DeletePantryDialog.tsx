"use client";

import {neutralButton, dangerButton} from "@/app/_lib/tailwind";
import {deletePantryItem} from "@/app/pantry/_lib/actions";
import {useActionState} from "react";
import type {PantryFormState} from "@/app/pantry/_lib/types";

type Props = {
  itemId: number;
  onCancel: () => void;
};

const initialState: PantryFormState = {};

export default function DeletePantryDialog({itemId, onCancel}: Props) {
  const [deleteState, deleteAction, deletePending] = useActionState(
    deletePantryItem,
    initialState,
  );
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm mt-4 text-neutral-700 dark:text-neutral-300">
        Möchtest du diesen Vorratseintrag wirklich löschen?
      </p>

      <div className="mt-4 flex justify-end items-center gap-2">
        <button type="button" className={neutralButton} onClick={onCancel}>
          Abbrechen
        </button>

        <form action={deleteAction} onSubmit={onCancel}>
          <input type="hidden" name="id" value={itemId} />

          <button
            type="submit"
            className={dangerButton}
            disabled={deletePending}
          >
            {deletePending ? "Löscht …" : "Löschen"}
          </button>
        </form>
      </div>
    </div>
  );
}
