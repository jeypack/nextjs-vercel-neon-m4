"use client";

import {useActionState} from "react";
import Link from "next/link";
import {updateProfile, type AuthState} from "@/lib/auth/actions";
import {primaryButton, inputClass, borderedButton} from "@/app/_lib/tailwind";

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
    <form action={formAction} className="space-y-5">
      <div>
        <label htmlFor="email" className="text-sm font-medium">
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

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="text-sm font-medium">
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
          <label htmlFor="lastName" className="text-sm font-medium">
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

      <div className="flex flex-wrap gap-3">
        <button disabled={pending} className={primaryButton}>
          {pending ? "Speichern …" : "Änderungen speichern"}
        </button>

        <Link
          href="/user"
          className={borderedButton}
        >
          Abbrechen
        </Link>
      </div>
    </form>
  );
}
