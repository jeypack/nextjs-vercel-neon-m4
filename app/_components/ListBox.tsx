import {
  Field,
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import {CheckIcon, ChevronDownIcon} from "@heroicons/react/20/solid";
import clsx from "clsx";
import {useState} from "react";
import {emeralInputClass, labelEmeralClass} from "@/app/_lib/tailwind";

interface ListBoxProps {
  data: {id: number; name: string}[];
  label?: string;
  name: string;
}

export default function ListBox({data, label, name}: ListBoxProps) {
  const [selected, setSelected] = useState(data[0]);

  const handleChange = (person: {id: number; name: string}) => {
    setSelected(person);
  };
  // const containerClass =
  //   "rounded-2xl border border-emerald-200 bg-emerald-50/70 shadow-sm dark:border-emerald-900 dark:bg-emerald-950/30 p-4 sm:p-6";
  
  return (
    <Field>
      <Label htmlFor={name} className={labelEmeralClass}>
        {label ?? "Select an option"}
      </Label>
      <Listbox value={selected} onChange={handleChange} name={name}>
        <ListboxButton
          className={emeralInputClass}
        >
          {selected.name}
          <ChevronDownIcon
            className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-white/60"
            aria-hidden="true"
          />
        </ListboxButton>
        <ListboxOptions
          anchor="bottom"
          transition
          className={clsx(
            "w-(--button-width) rounded-xl border border-emerald-200 bg-emerald-50/70 dark:border-emerald-900 dark:bg-black/75 p-1 [--anchor-gap:--spacing(1)] focus:outline-none",
            "transition duration-100 ease-in data-leave:data-closed:opacity-0",
          )}
        >
          {data.map((person) => (
            <ListboxOption
              key={person.name}
              value={person}
              className="group flex cursor-default items-center gap-2 rounded-lg px-3 py-1.5 select-none data-focus:bg-white/10"
            >
              <CheckIcon className="invisible size-4 dark:fill-white group-data-selected:visible" />
              <div className="text-sm/6 dark:text-white">{person.name}</div>
            </ListboxOption>
          ))}
        </ListboxOptions>
      </Listbox>
    </Field>
  );
}
