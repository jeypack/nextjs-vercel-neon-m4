"use client";

import {neutralButton, dangerButton} from "@/app/_lib/tailwind";
import {deleteBoughtShoppingItems} from "@/app/shopping-list/_lib/actions";
import {Trash2} from "lucide-react";

type Props = {
  userId: number;
  onCancel: () => void;
};

export default function DeleteBoughtItemsDialog({userId, onCancel}: Props) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm mt-4 text-neutral-700 dark:text-neutral-300">
        Möchtest du wirklich alle gekauften Artikel löschen?
      </p>

      <div className="mt-4 flex justify-end items-center gap-2">
        <button type="button" className={neutralButton} onClick={onCancel}>
          Abbrechen
        </button>

        <form action={deleteBoughtShoppingItems} onSubmit={onCancel}>
          <input type="hidden" name="id" value={userId} />
          <button
            type="submit"
            className={dangerButton}
            aria-label="Gekaufte Artikel löschen"
          >
            <span className="inline-flex items-center gap-1.5">
              <Trash2 size={14} aria-hidden="true" />
              Gekaufte Artikel löschen
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}
