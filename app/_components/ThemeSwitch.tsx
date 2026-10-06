"use client";

import { Switch } from "@headlessui/react";
import { useState, useEffect } from "react";
import { useTheme } from 'next-themes'

export default function ThemeSwitch() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // The active theme is not available on the server.
  // If you have styling that is conditionally applied based on the active-theme,
  // you have to await the mounted state before rendering the active theme.
  useEffect(() => setMounted(true), [])

  //if (!mounted) return null;

  const handleToggle = () => {
    // console.log("ThemeSwitch handleToggle:", theme);
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="flex items-center justify-center w-30">
      <Switch
        checked={mounted && theme === "dark"}
        onChange={handleToggle}
        className="group relative flex h-6 w-13 cursor-pointer rounded-full bg-gray-300 dark:bg-white/10 p-1 ease-in-out focus:not-data-focus:outline-none data-checked:bg-white/10 data-focus:outline data-focus:outline-white"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none inline-block size-4 translate-x-0 rounded-full bg-gray-50 dark:bg-white/90 shadow-lg ring-0 transition duration-200 ease-in-out group-data-checked:translate-x-7"
        />
      </Switch>
      <span className="ml-2 text-xs font-medium text-gray-500 dark:text-gray-200 uppercase">
        {mounted && theme}
      </span>
    </div>
  );
}
