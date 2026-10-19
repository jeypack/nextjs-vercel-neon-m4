"use client";

import {useActionState} from "react";
import {deleteAccount, type AuthState} from "@/lib/auth/actions";

const initialState: AuthState = {};

export default function DeleteAccountForm() {
  const [state, formAction, pending] = useActionState(
    deleteAccount,
    initialState,
  );

  return (
    <section className="mt-10 rounded-xl border border-gray-300 p-5 dark:border-gray-700">
      <h2 className="text-lg font-semibold">Konto löschen</h2>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Dein Konto und deine zugehörigen Sessions werden gelöscht. Diese Aktion
        kann nicht rückgängig gemacht werden.
      </p>

      <form action={formAction} className="mt-4 space-y-4">
        <div>
          <label htmlFor="delete-password" className="text-sm font-medium">
            Passwort zur Bestätigung
          </label>
          <input
            id="delete-password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>

        {state.error && (
          <p role="alert" className="text-sm text-red-600 dark:text-red-400">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="cursor-pointer border border-gray-400 px-4 py-2 rounded-lg text-sm font-semibold text-gray-800 hover:bg-gray-100 disabled:opacity-50 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-800"
        >
          {pending ? "Konto wird gelöscht …" : "Konto endgültig löschen"}
        </button>
      </form>
    </section>
  );
}
