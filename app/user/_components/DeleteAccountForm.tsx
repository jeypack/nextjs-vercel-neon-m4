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
    <section className="mt-10 rounded-xl border border-neutral-300 p-5 dark:border-neutral-700">
      <h2 className="text-lg font-semibold">Konto löschen</h2>
      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
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
            className="mt-1 block w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-900 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
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
          className="cursor-pointer border border-neutral-400 px-4 py-2 rounded-lg text-sm font-semibold text-neutral-800 hover:bg-neutral-100 disabled:opacity-50 dark:border-neutral-600 dark:text-neutral-100 dark:hover:bg-neutral-800"
        >
          {pending ? "Konto wird gelöscht …" : "Konto endgültig löschen"}
        </button>
      </form>
    </section>
  );
}
