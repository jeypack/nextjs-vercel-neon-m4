"use client";

import {useState, type SubmitEvent} from "react";
import FilterCombobox from "@/app/_components/FilterCombobox";
import {PACKAGE_SIZE_UNITS, PANTRY_UNITS} from "@/app/_lib/units";
import {
  inputClass,
  labelClass,
  panelClass,
  primaryButton,
  secondaryButton,
} from "@/app/_lib/tailwind";
import {createPantryItem} from "@/app/pantry/_lib/actions";
import type {PantryFormState} from "@/app/pantry/_lib/types";

const initialState: PantryFormState = {};

function ErrorText({message}: {message?: string}) {
  if (!message) {
    return null;
  }

  return <p className="mt-2 text-xs text-red-600 dark:text-red-400">{message}</p>;
}

export default function PantryCreateForm({
  ingredientNames,
}: {
  ingredientNames: string[];
}) {
  const [ingredientInput, setIngredientInput] = useState("");
  const [unitInput, setUnitInput] = useState("");
  const [packageUnitInput, setPackageUnitInput] = useState("");
  const [state, setState] = useState<PantryFormState>(initialState);
  const [pending, setPending] = useState(false);

  const handleFormReset = () => {
    setIngredientInput("");
    setUnitInput("");
    setPackageUnitInput("");
    setState(initialState);
  };

  const handleIngredientAdd = (value: string) => {
    const normalized = value.trim();

    if (!normalized) {
      return;
    }

    setIngredientInput(normalized);
  };

  const handleUnitAdd = (value: string) => {
    const normalized = value.trim();

    if (!normalized) {
      setUnitInput("");
      return;
    }

    setUnitInput(normalized);
  };

  const handlePackageUnitAdd = (value: string) => {
    const normalized = value.trim();

    if (!normalized) {
      setPackageUnitInput("");
      return;
    }

    setPackageUnitInput(normalized);
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    setPending(true);
    const result = await createPantryItem({}, formData);
    setPending(false);
    setState(result);

    if (result.success) {
      form.reset();
      setIngredientInput("");
      setUnitInput("");
      setPackageUnitInput("");
    }
  };

  return (
    <section className={`${panelClass} p-4 sm:p-6`}>
      <div className="mb-6">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400">
          Neuer Eintrag
        </p>
        <h2 className="mt-2 text-2xl font-bold text-neutral-900 dark:text-white">
          Vorrat ergänzen
        </h2>
      </div>

      <form
        onSubmit={handleSubmit}
        onReset={handleFormReset}
        className="space-y-5"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="ingredient" className={labelClass}>
              Zutat*
            </label>
            <FilterCombobox
              ingredientNames={ingredientNames}
              value={ingredientInput}
              onChange={setIngredientInput}
              onAdd={handleIngredientAdd}
              name="ingredient"
            />
            <ErrorText message={state.errors?.ingredient?.[0]} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="quantity" className={labelClass}>
              Menge
            </label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              min="0"
              step="0.1"
              placeholder="2"
              className={inputClass}
            />
            <ErrorText message={state.errors?.quantity?.[0]} />
          </div>

          <div>
            <label htmlFor="unit" className={labelClass}>
              Einheit
            </label>
            <FilterCombobox
              ingredientNames={[...PANTRY_UNITS]}
              value={unitInput}
              onChange={setUnitInput}
              onAdd={handleUnitAdd}
              name="unit"
              placeholder="Einheit auswählen"
              editable={false}
            />
            <ErrorText message={state.errors?.unit?.[0]} />
          </div>

          <div>
            <label htmlFor="expiresAt" className={labelClass}>
              Ablaufdatum
            </label>
            <input
              id="expiresAt"
              name="expiresAt"
              type="date"
              className={inputClass}
            />
            <ErrorText message={state.errors?.expiresAt?.[0]} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="packageSize" className={labelClass}>
              Packungsgröße
            </label>
            <input
              id="packageSize"
              name="packageSize"
              type="number"
              min="0"
              step="0.1"
              placeholder="z. B. 400"
              className={inputClass}
            />
            <ErrorText message={state.errors?.packageSize?.[0]} />
          </div>

          <div>
            <label htmlFor="packageUnit" className={labelClass}>
              Packungseinheit
            </label>
            <FilterCombobox
              ingredientNames={[...PACKAGE_SIZE_UNITS]}
              value={packageUnitInput}
              onChange={setPackageUnitInput}
              onAdd={handlePackageUnitAdd}
              name="packageUnit"
              placeholder="z. B. g oder ml"
              editable={false}
            />
            <ErrorText message={state.errors?.packageUnit?.[0]} />
          </div>
        </div>

        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Für Einheiten wie Dose oder Packung bitte die Packungsgröße und Packungseinheit ergänzen.
        </p>

        <div>
          <label htmlFor="notes" className={labelClass}>
            Notiz
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            placeholder="Optional: z. B. „für Pasta verwenden“"
            className={`${inputClass} resize-none`}
          />
          <ErrorText message={state.errors?.notes?.[0]} />
        </div>

        {state.message ? (
          <p
            role="status"
            className={state.success ? "text-sm text-emerald-700 dark:text-emerald-400" : "text-sm text-red-600 dark:text-red-400"}
          >
            {state.message}
          </p>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button type="reset" className={secondaryButton}>
            Zurücksetzen
          </button>
          <button type="submit" disabled={pending} className={`${primaryButton} w-full sm:w-auto`}>
            {pending ? "Wird gespeichert…" : "Vorrat speichern"}
          </button>
        </div>
      </form>
    </section>
  );
}
