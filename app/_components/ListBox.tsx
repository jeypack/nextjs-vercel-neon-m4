import {
  Field,
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import {CheckIcon, ChevronDownIcon} from "@heroicons/react/20/solid";
import {useMemo, useState} from "react";
import {
  emeralInputClass,
  labelEmeralClass,
  optionsClass,
} from "@/app/_lib/tailwind";

type ListBoxOption = {
  id: number | string;
  name: string;
};

interface ListBoxProps {
  data: ListBoxOption[];
  label?: string;
  name: string;
  placeholder?: string;
  defaultValue?: number | string;
  required?: boolean;
}

function getInitialSelectedId(
  data: ListBoxOption[],
  defaultValue?: number | string,
): number | string | null {
  if (defaultValue !== undefined) {
    const matchingOption = data.find((option) => option.id === defaultValue);
    return matchingOption?.id ?? null;
  }

  return data[0]?.id ?? null;
}

export default function ListBox({
  data,
  label,
  name,
  placeholder,
  defaultValue,
  required = false,
}: ListBoxProps) {
  const [selectedId, setSelectedId] = useState<number | string | null>(
    getInitialSelectedId(data, defaultValue),
  );

  const selectedOption = useMemo(
    () => data.find((option) => option.id === selectedId) ?? null,
    [data, selectedId],
  );

  return (
    <Field>
      <input type="hidden" name={name} value={selectedId ?? ""} />
      <Label htmlFor={name} className={labelEmeralClass}>
        {label ?? "Select an option"}
      </Label>
      <Listbox name={name} value={selectedId} onChange={setSelectedId}>
        <ListboxButton className={emeralInputClass} aria-required={required}>
          {selectedOption?.name ?? placeholder ?? "Bitte wählen"}
          <ChevronDownIcon
            className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-white/60"
            aria-hidden="true"
          />
        </ListboxButton>
        <ListboxOptions anchor="bottom" transition className={optionsClass}>
          {data.map((option) => (
            <ListboxOption
              key={`${name}-${option.id}`}
              value={option.id}
              className="group flex cursor-default items-center gap-2 rounded-lg px-3 py-1.5 select-none data-focus:bg-white/10"
            >
              <CheckIcon className="invisible size-4 dark:fill-white group-data-selected:visible" />
              <div className="text-sm/6 dark:text-white">{option.name}</div>
            </ListboxOption>
          ))}
        </ListboxOptions>
      </Listbox>
    </Field>
  );
}
