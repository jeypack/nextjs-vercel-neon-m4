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

  //const labelClass = "text-sm font-medium text-gray-700 dark:text-gray-500";

  return (
    <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900 sm:p-8">
      <form action={formAction} className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
        <div>
          <label htmlFor="email" className={labelClass}>
            E-Mail-Adresse
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            defaultValue={user.email}
            required
            className={inputClass}
          />
        </div>

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

        {state.error && (
          <p role="alert" className="text-sm text-red-600 dark:text-red-400">
            {state.error}
          </p>
        )}

        {state.success && (
          <p role="status" className="text-sm text-gray-600 dark:text-gray-300">
            {state.success}
          </p>
        )}

        <div className="flex gap-3">
          <button disabled={pending} className={primaryButton}>
            {pending ? "Speichern …" : "Änderungen speichern"}
          </button>

          <Link href="/user" className={borderedButton}>
            Abbrechen
          </Link>
        </div>
      </form>
    </section>
  );
}
