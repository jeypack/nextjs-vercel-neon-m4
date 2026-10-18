"use client";

import {deleteUser} from "@/app/user/_lib/actions";

type Props = {
  userId: number;
  onCancel: () => void;
};

export default function DeleteUserDialog({userId, onCancel}: Props) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm mt-4 text-gray-700 dark:text-gray-300">Möchtest du diesen User wirklich löschen?</p>

      <div className="mt-4 flex justify-end gap-2">
        <button
          type="button"
          className="cursor-pointer rounded bg-gray-600 px-4 py-2 text-sm font-medium text-white focus:not-data-focus:outline-none focus:outline focus:outline-white hover:bg-gray-700 dark:bg-gray-800 "
          onClick={onCancel}
        >
          Abbrechen
        </button>

        <form action={deleteUser} onSubmit={onCancel}>
          <input type="hidden" name="id" value={userId} />

          <button
            type="submit"
            className="cursor-pointer rounded bg-red-800 hover:bg-red-700 px-4 py-2 text-sm font-medium text-white"
          >
            Löschen
          </button>
        </form>
      </div>
    </div>
  );
}
