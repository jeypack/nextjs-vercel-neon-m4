"use client";

import {useActionState} from "react";
import Link from "next/link";
import {updateProfile, type AuthState} from "@/lib/auth/actions";
import {primaryButton, inputClass, borderedButton, labelClass} from "@/app/_lib/tailwind";

type ProfileFormProps = {
  user: {
    email: string;
    firstName: string | null;
    lastName: string | null;
  };
};

const initialState: AuthState = {};

export default function ProfileForm({user}: ProfileFormProps) {
  const [state, formAction, pending] = useActionState(
    updateProfile,
    initialState,
  );

  return (
    <section className="mt-8 rounded-2xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900 p-6 shadow-sm sm:p-8">
      <form action={formAction} className="space-y-4">
        <div>
          <label htmlFor="email" className={labelClass}>
            E-Mail-Adresse
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            defaultValue={user.email}
            readOnly
            aria-readonly="true"
            className={`${inputClass} cursor-not-allowed opacity-70`}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="firstName" className={labelClass}>
              Vorname
            </label>
            <input
              id="firstName"
              name="firstName"
              autoComplete="given-name"
              defaultValue={user.firstName ?? ""}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="lastName" className={labelClass}>
              Nachname
            </label>
            <input
              id="lastName"
              name="lastName"
              autoComplete="family-name"
              defaultValue={user.lastName ?? ""}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid gap-4 mb-8 sm:grid-cols-2">
          <div>
            <label htmlFor="password" className={labelClass}>
              Neues Passwort
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              className={inputClass}
              placeholder="Mindestens 8 Zeichen"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className={labelClass}>
              Neues Passwort wiederholen
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              minLength={8}
              className={inputClass}
              placeholder="Passwort erneut eingeben"
            />
          </div>
        </div>

        {state.error && (
          <p role="alert" className="text-sm text-red-600 dark:text-red-400">
            {state.error}
          </p>
        )}

        {state.success && (
          <p role="status" className="text-sm text-neutral-600 dark:text-neutral-300">
            {state.success}
          </p>
        )}

        <div className="flex gap-3">
          <button disabled={pending} className={primaryButton}>
            {pending ? "Speichern …" : "Änderungen speichern"}
          </button>

          {/* <button type="reset" className={borderedButton} onClick={}>
            Reset
          </button> */}
        </div>
      </form>
    </section>
  );
}
