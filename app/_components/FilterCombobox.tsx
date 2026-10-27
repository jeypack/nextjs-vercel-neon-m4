import {
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
  ComboboxButton,
} from "@headlessui/react";
import {ChevronDownIcon} from "@heroicons/react/24/solid";
import {inputClass} from "@/app/_lib/tailwind";

interface FilterComboboxProps {
  ingredientNames: string[];
  value: string;
  onChange: (value: string) => void;
  onAdd: (value: string) => void;
  name?: string;
  placeholder?: string;
  editable?: boolean;
}

export default function FilterCombobox({
  ingredientNames,
  value,
  onChange,
  onAdd,
  name,
  placeholder,
  editable = true,
}: FilterComboboxProps) {
  const normalizedValue = value.trim().toLocaleLowerCase("de-DE");

  const filteredIngredients = normalizedValue
    ? ingredientNames.filter((name) =>
        name.toLocaleLowerCase("de-DE").includes(normalizedValue),
      )
    : ingredientNames;

  return (
    <Combobox
      immediate={true}
      value={value}
      onChange={(selected: string | null) => {
        if (selected) {
          onAdd(selected);
        }
      }}
      /* onClose={() => onChange("")} */
    >
      <div className="relative min-w-0 flex-1">
        <ComboboxInput
          id={name ?? "ingredient"}
          name={name}
          autoComplete="off"
          displayValue={(ingredient: string) => ingredient}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();

              const exactMatch = ingredientNames.find(
                (name) => name.toLocaleLowerCase("de-DE") === normalizedValue,
              );

              onAdd(exactMatch ?? value);
            }
          }}
          readOnly={!editable}
          placeholder={placeholder ?? "z. B. Tomate, Zwiebel, Pasta"}
          className={inputClass}
        />
        <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
          <ChevronDownIcon className="size-4 fill-white/60 group-data-hover:fill-white" />
        </ComboboxButton>
        <ComboboxOptions
          anchor="bottom"
          className="z-10 mt-1 h-80 w-(--input-width) overflow-auto rounded-lg border border-neutral-200 bg-white p-1 shadow-lg empty:invisible dark:border-neutral-700 dark:bg-neutral-900"
        >
          {filteredIngredients.map((name) => (
            <ComboboxOption
              key={name}
              value={name}
              className="cursor-pointer rounded-md px-3 py-2 text-sm text-neutral-800 data-focus:bg-emerald-50 data-focus:text-emerald-900 dark:text-neutral-100 dark:data-focus:bg-emerald-950 dark:data-focus:text-emerald-200"
            >
              {name}
            </ComboboxOption>
          ))}
        </ComboboxOptions>
      </div>
    </Combobox>
  );
}
