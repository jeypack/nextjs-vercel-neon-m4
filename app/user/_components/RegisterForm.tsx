"use client";

import {useActionState} from "react";
import {register} from "@/lib/auth/actions";
import {inputClass, labelClass, primaryButton} from "@/app/_lib/tailwind";
import {ErrorMessage} from "@/app/user/_components/AuthTabs";

const buttonClass = primaryButton + " w-full sm:w-auto";

export default function RegisterForm() {
  const [registerState, registerAction, registering] = useActionState(
    register,
    {},
  );

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900 sm:p-8 md:min-w-2xl">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
        Konto erstellen
      </h2>

      <p className="mb-6 mt-2 text-sm text-gray-500 dark:text-gray-400">
        Deine E-Mail und ein Passwort genügen. Deinen Namen kannst du später
        ergänzen.
      </p>

      <form action={registerAction} className="space-y-4">
        <div>
          <label htmlFor="register-email" className={labelClass + " sr-only"}>
            E-Mail-Adresse*
          </label>
          <input
            id="register-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className={inputClass}
            placeholder="du@beispiel.de*"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="register-firstName" className={labelClass}>
              Vorname (optional)
            </label>
            <input
              id="register-firstName"
              name="firstName"
              autoComplete="given-name"
              className={inputClass}
              placeholder="Vorname"
            />
          </div>

          <div>
            <label htmlFor="register-lastName" className={labelClass}>
              Nachname (optional)
            </label>
            <input
              id="register-lastName"
              name="lastName"
              autoComplete="family-name"
              className={inputClass}
              placeholder="Nachname"
            />
          </div>
        </div>

        <div>
          <label htmlFor="register-password" className={labelClass}>
            Passwort*
          </label>
          <input
            id="register-password"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
            className={inputClass}
            placeholder="Mindestens 8 Zeichen"
          />
        </div>

        <div>
          <label htmlFor="register-confirmPassword" className={labelClass}>
            Passwort wiederholen*
          </label>
          <input
            id="register-confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
            className={inputClass}
            placeholder="Passwort erneut eingeben"
          />
        </div>

        <ErrorMessage message={registerState.error} />

        <button type="submit" disabled={registering} className={buttonClass}>
          {registering ? "Konto wird erstellt …" : "Registrieren"}
        </button>
      </form>
    </section>
  );
}
