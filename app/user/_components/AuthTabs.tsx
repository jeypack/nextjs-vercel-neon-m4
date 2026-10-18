"use client";

import {primaryButton, inputClass, tabClass, labelClass} from "@/app/_lib/tailwind";
import {Tab, TabGroup, TabList, TabPanel, TabPanels} from "@headlessui/react";
import {useActionState} from "react";
import {register, login} from "@/lib/auth/actions";

const buttonClass = primaryButton + " w-full sm:w-auto";

function ErrorMessage({message}: {message?: string}) {
  if (!message) return null;

  return (
    <p
      role="alert"
      className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
    >
      {message}
    </p>
  );
}

export default function AuthTabs() {
  const [registerState, registerAction, registering] = useActionState(
    register,
    {},
  );

  const [loginState, loginAction, loggingIn] = useActionState(login, {});

  return (
    <div className="mx-auto max-w-4xl">
      <TabGroup>
        <TabList className="mb-6 flex gap-2 rounded-xl border border-gray-200 bg-gray-100 p-1 dark:border-gray-700 dark:bg-gray-900">
          <Tab className={tabClass}>
            Registrieren
          </Tab>

          <Tab className={tabClass}>
            Login
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            {/* Registrierungsformular */}
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900 sm:p-8 md:min-w-2xl">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Konto erstellen
              </h2>

              <p className="mb-6 mt-2 text-sm text-gray-500 dark:text-gray-400">
                Deine E-Mail und ein Passwort genügen. Deinen Namen kannst du
                später ergänzen.
              </p>

              <form action={registerAction} className="space-y-4">
                <div>
                  <label
                    htmlFor="register-email"
                    className={labelClass + " sr-only"}
                  >
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
                    <label
                      htmlFor="register-firstName"
                      className={labelClass}
                    >
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
                    <label
                      htmlFor="register-lastName"
                      className={labelClass}
                    >
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
                  <label
                    htmlFor="register-password"
                    className={labelClass}
                  >
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
                  <label
                    htmlFor="register-confirmPassword"
                    className={labelClass}
                  >
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

                <button
                  type="submit"
                  disabled={registering}
                  className={buttonClass}
                >
                  {registering ? "Konto wird erstellt …" : "Registrieren"}
                </button>
              </form>
            </section>
          </TabPanel>

          <TabPanel>
            {/* Loginformular */}
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900 sm:p-8 md:min-w-2xl">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Willkommen zurück
              </h2>

              <p className="mb-6 mt-2 text-sm text-gray-500 dark:text-gray-400">
                Melde dich mit deinen Zugangsdaten an.
              </p>

              <form action={loginAction} className="space-y-4">
                <div>
                  <label
                    htmlFor="login-email"
                    className={labelClass}
                  >
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
                  <label
                    htmlFor="login-password"
                    className={labelClass}
                  >
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

                <button
                  type="submit"
                  disabled={loggingIn}
                  className={buttonClass}
                >
                  {loggingIn ? "Anmeldung läuft …" : "Einloggen"}
                </button>
              </form>
            </section>
          </TabPanel>
        </TabPanels>
      </TabGroup>

      <p className="mt-5 text-center text-xs text-gray-500 dark:text-gray-400">
        Mit der Registrierung akzeptierst du die Nutzungsbedingungen deiner
        Anwendung.
      </p>
    </div>
  );
}
