"use client";

import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import {CheckIcon, ChevronDownIcon} from "@heroicons/react/20/solid";
import clsx from "clsx";
import {useState} from "react";

const roles = ["USER", "ADMIN"] as const;
type UserRole = (typeof roles)[number];

export default function UserRoleList({defaultValue}: {defaultValue: UserRole}) {
  const [selected, setSelected] = useState<UserRole>(defaultValue);
  return (
    <Listbox as={"div"} name="role" value={selected} onChange={setSelected}>
      <ListboxButton
        className={clsx(
          "cursor-pointer relative w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 pr-9 text-left text-sm text-gray-900",
          "focus:outline-none focus:ring-2 focus:ring-gray-400",
          "dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100",
        )}
      >
        {selected === "USER" ? "User" : "Admin"}
        <ChevronDownIcon className="pointer-events-none absolute right-3 top-3 size-4 text-gray-500" />
      </ListboxButton>

      <ListboxOptions
        anchor="bottom"
        className="z-50 mt-1 w-(--button-width) rounded-lg border border-gray-200 bg-white p-1 shadow-lg focus:outline-none dark:border-gray-700 dark:bg-gray-800"
      >
        {roles.map((role) => (
          <ListboxOption
            key={role}
            value={role}
            className="group flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-900 data-focus:bg-gray-100 dark:text-gray-100 dark:data-focus:bg-gray-700"
          >
            <CheckIcon className="invisible size-4 group-data-selected:visible" />
            {role === "USER" ? "User" : "Admin"}
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  );
}
