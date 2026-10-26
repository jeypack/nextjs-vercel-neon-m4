"use client";

import { neutralButton } from "@/app/_lib/tailwind";
import {deleteUser} from "@/app/user/_lib/actions";

type Props = {
  userId: number;
  onCancel: () => void;
};

export default function DeleteUserDialog({userId, onCancel}: Props) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm mt-4 text-neutral-700 dark:text-neutral-300">Möchtest du diesen User wirklich löschen?</p>

      <div className="mt-4 flex justify-end items-center gap-2">
        <button
          type="button"
          className={neutralButton}
          onClick={onCancel}
        >
          Abbrechen
        </button>

        <form action={deleteUser} onSubmit={onCancel}>
          <input type="hidden" name="id" value={userId} />

          <button
            type="submit"
            className="cursor-pointer rounded-lg bg-red-800 hover:bg-red-700 px-4 py-2.5 text-sm font-medium text-white"
          >
            Löschen
          </button>
        </form>
      </div>
    </div>
  );
}
