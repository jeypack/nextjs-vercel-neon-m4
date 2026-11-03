"use client";

import {tabClass} from "@/app/_lib/tailwind";
import {Tab, TabGroup, TabList, TabPanel, TabPanels} from "@headlessui/react";
import LoginForm from "@/app/user/_components/LoginForm";
import RegisterForm from "@/app/user/_components/RegisterForm";

export function ErrorMessage({message}: {message?: string}) {
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

export default function AuthTabs({defaultIndex}: {defaultIndex: number}) {

  return (
    <div className="mx-auto w-full">
      <TabGroup defaultIndex={defaultIndex}>
        <TabList className="mb-6 flex gap-2 rounded-xl border border-neutral-200 bg-neutral-100 p-1 dark:border-neutral-700 dark:bg-neutral-900">
          <Tab className={tabClass}>Registrieren</Tab>
          <Tab className={tabClass}>Login</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <RegisterForm />
          </TabPanel>

          <TabPanel>
            <LoginForm />
          </TabPanel>
        </TabPanels>
      </TabGroup>

      <p className="mt-5 text-center text-xs text-neutral-500 dark:text-neutral-400">
        Mit der Registrierung akzeptierst du die Nutzungsbedingungen deiner
        Anwendung.
      </p>
    </div>
  );
}
