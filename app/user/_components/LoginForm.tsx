"use client";

import {useActionState, useEffect} from "react";
import {login} from "@/lib/auth/actions";
import {inputClass, labelClass, primaryButton} from "@/app/_lib/tailwind";
import {ErrorMessage} from "@/app/user/_components/AuthTabs";
import {useModal} from "@/app/_context/ModalContext";

const buttonClass = primaryButton + " w-full sm:w-auto";

export default function LoginForm() {
  const { close } = useModal();
  const [loginState, loginAction, loggingIn] = useActionState(login, {});

  useEffect(() => {
    if (loginState.success) {
      close();
    }
  }, [loginState.success, close]);

  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-900 sm:p-8 md:min-w-2xl">
      <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
        Willkommen zurück
      </h2>

      <p className="mb-6 mt-2 text-sm text-neutral-500 dark:text-neutral-400">
        Melde dich mit deinen Zugangsdaten an.
      </p>

      <form action={loginAction} className="space-y-4">
        <div>
          <label htmlFor="login-email" className={labelClass}>
            E-Mail-Adresse*
          </label>
          <input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className={inputClass}
            placeholder="du@beispiel.de"
          />
        </div>

        <div>
          <label htmlFor="login-password" className={labelClass}>
            Passwort*
          </label>
          <input
            id="login-password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className={inputClass}
            placeholder="Dein Passwort"
          />
        </div>

        <ErrorMessage message={loginState.error} />

        <button type="submit" disabled={loggingIn} className={buttonClass + " mt-2"}>
          {loggingIn ? "Anmeldung läuft …" : "Einloggen"}
        </button>
      </form>
    </section>
  );
}
