import {useRef} from "react";
import {
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
  ComboboxButton,
} from "@headlessui/react";
import {ChevronDownIcon} from "@heroicons/react/24/solid";
import {emeralInputClass, optionsClass} from "@/app/_lib/tailwind";

interface FilterComboboxProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  onAdd: (value: string) => void;
  name?: string;
  inputId?: string;
  placeholder?: string;
  editable?: boolean;
  allowCustomValue?: boolean;
  selectOnFocus?: boolean;
  clearOnFocus?: boolean;
}

export default function FilterCombobox({
  options,
  value,
  onChange,
  onAdd,
  name,
  inputId,
  placeholder,
  editable = true,
  selectOnFocus = true,
  allowCustomValue = true,
  clearOnFocus = false,
}: FilterComboboxProps) {
  const normalizedValue = value.trim().toLocaleLowerCase("de-DE");
  const previousValue = useRef(value);
  const hasChanged = useRef(false);
  const filteredIngredients = normalizedValue
    ? options.filter((name) =>
        name.toLocaleLowerCase("de-DE").includes(normalizedValue),
      )
    : options;

  return (
    <Combobox
      immediate={true}
      name={name}
      value={value}
      onChange={(selected: string | null) => {
        if (selected) {
          hasChanged.current = true;
          onAdd(selected);
        }
      }}
      onClose={() => {
        if (clearOnFocus && !hasChanged.current) {
          onChange(previousValue.current);
        }
      }}
    >
      <div className="relative min-w-0 flex-1">
        <ComboboxInput
          id={inputId ?? name ?? "ingredient"}
          autoComplete="off"
          displayValue={(ingredient: string) => ingredient}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();

              const exactMatch = options.find(
                (name) => name.toLocaleLowerCase("de-DE") === normalizedValue,
              );

              if (exactMatch) {
                onAdd(exactMatch);
                return;
              }

              if (allowCustomValue) {
                const trimmedValue = value.trim();

                if (trimmedValue) {
                  onAdd(trimmedValue);
                }
              }
            }
          }}
          onFocus={(event) => {
            if (clearOnFocus && editable) {
              previousValue.current = value;
              hasChanged.current = false;
              onChange("");
              return;
            }

            if (selectOnFocus) {
              event.currentTarget.select();
            }
          }}
          readOnly={!editable}
          placeholder={placeholder ?? "z. B. Tomate, Zwiebel, Pasta"}
          className={emeralInputClass}
        />
        <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
          <ChevronDownIcon className="size-4 fill-white/60 group-data-hover:fill-white" />
        </ComboboxButton>
        <ComboboxOptions
          anchor="bottom"
          className={optionsClass + " z-10 mt-1 w-(--input-width)"}
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
