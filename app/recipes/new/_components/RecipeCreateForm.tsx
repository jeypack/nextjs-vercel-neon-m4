"use client";

import {useActionState, useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import FilterCombobox from "@/app/_components/FilterCombobox";
import {createRecipe} from "@/app/recipes/_lib/actions";
import type {
  RecipeCreateFormProps,
  RecipeCreateFormState,
} from "@/app/recipes/_lib/types";
import {
  emeralInputClass,
  labelEmeralClass,
  primaryButton,
  secondaryButton,
  emeraldButton,
} from "@/app/_lib/tailwind";
import ListBox from "@/app/_components/ListBox";

type IngredientRow = {
  id: string;
  name: string;
  unit: string;
};

const initialState: RecipeCreateFormState = {};

function ErrorText({messages}: {messages?: string[]}) {
  if (!messages?.length) {
    return null;
  }

  return (
    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
      {messages.join(", ")}
    </p>
  );
}

export default function RecipeCreateForm({
  categories,
  ingredientNames,
  unitNames,
}: RecipeCreateFormProps) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    createRecipe,
    initialState,
  );
  const [ingredientRows, setIngredientRows] = useState<IngredientRow[]>([
    {id: "ingredient-row-1", name: "", unit: ""},
  ]);
  const [nextRowNumber, setNextRowNumber] = useState(2);

  useEffect(() => {
    if (!state.success || !state.recipeId) {
      return;
    }

    router.push(`/recipes/${state.recipeId}`);
  }, [router, state.recipeId, state.success]);

  const addIngredientRow = () => {
    setIngredientRows((prevRows) => [
      ...prevRows,
      {id: `ingredient-row-${nextRowNumber}`, name: "", unit: ""},
    ]);
    setNextRowNumber((current) => current + 1);
  };

  const removeIngredientRow = (rowId: string) => {
    setIngredientRows((prevRows) => {
      if (prevRows.length === 1) {
        return prevRows;
      }

      return prevRows.filter((row) => row.id !== rowId);
    });
  };

  const updateIngredientName = (rowId: string, value: string) => {
    setIngredientRows((prevRows) =>
      prevRows.map((row) => (row.id === rowId ? {...row, name: value} : row)),
    );
  };

  const updateIngredientUnit = (rowId: string, value: string) => {
    setIngredientRows((prevRows) =>
      prevRows.map((row) => (row.id === rowId ? {...row, unit: value} : row)),
    );
  };

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="title" className={labelEmeralClass}>
            Rezepttitel*
          </label>
          <input
            id="title"
            name="title"
            required
            maxLength={120}
            className={emeralInputClass}
            placeholder="z. B. Cremige Tomatenpasta"
          />
          <ErrorText messages={state.errors?.title} />
        </div>

        <div>
          <ListBox name="categoryId" data={categories} label="Bitte wählen*" />
          {/* <label htmlFor="categoryId" className={labelEmeralClass}>
            Kategorie*
          </label>
          <select
            id="categoryId"
            name="categoryId"
            required
            className={inputClass}
          >
            <option value="">Bitte wählen</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select> */}
          <ErrorText messages={state.errors?.categoryId} />
        </div>

        <div>
          <ListBox
            name="difficulty"
            data={[
              {id: 1, name: "Einfach"},
              {id: 2, name: "Mittel"},
              {id: 3, name: "Anspruchsvoll"},
            ]}
            label="Schwierigkeit*"
          />
          {/* <label htmlFor="difficulty" className={labelEmeralClass}>
            Schwierigkeit*
          </label>
          <select
            id="difficulty"
            name="difficulty"
            defaultValue="MEDIUM"
            required
            className={inputClass}
          >
            <option value="EASY">Einfach</option>
            <option value="MEDIUM">Mittel</option>
            <option value="HARD">Anspruchsvoll</option>
          </select> */}
          <ErrorText messages={state.errors?.difficulty} />
        </div>

        <div>
          <label htmlFor="prepTime" className={labelEmeralClass}>
            Vorbereitungszeit (Minuten)*
          </label>
          <input
            id="prepTime"
            name="prepTime"
            type="number"
            min="1"
            step="1"
            required
            placeholder="30"
            className={emeralInputClass}
          />
          <ErrorText messages={state.errors?.prepTime} />
        </div>

        <div>
          <label htmlFor="servings" className={labelEmeralClass}>
            Portionen*
          </label>
          <input
            id="servings"
            name="servings"
            type="number"
            min="1"
            step="1"
            required
            defaultValue={2}
            className={emeralInputClass}
          />
          <ErrorText messages={state.errors?.servings} />
        </div>
      </div>

      <div>
        <label htmlFor="description" className={labelEmeralClass}>
          Beschreibung
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          maxLength={500}
          className={`${emeralInputClass} resize-none`}
          placeholder="Optional: Kurze Beschreibung des Rezepts"
        />
        <ErrorText messages={state.errors?.description} />
      </div>

      <div>
        <label htmlFor="instructions" className={labelEmeralClass}>
          Zubereitung*
        </label>
        <textarea
          id="instructions"
          name="instructions"
          rows={6}
          required
          maxLength={5000}
          className={`${emeralInputClass} resize-y`}
          placeholder="Beschreibe die Schritte für die Zubereitung."
        />
        <ErrorText messages={state.errors?.instructions} />
      </div>

      <div className="space-y-3 rounded-xl border border-neutral-200 p-4 dark:border-neutral-700">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            Zutaten*
          </h3>
          <button
            type="button"
            onClick={addIngredientRow}
            className={primaryButton}
          >
            Zutat hinzufügen
          </button>
        </div>

        <div className="space-y-3">
          {ingredientRows.map((row, index) => (
            <div
              key={row.id}
              className="grid gap-3 rounded-lg bg-neutral-50 p-3 dark:bg-neutral-800/50"
            >
              <div className="grid gap-3 sm:grid-cols-[1.2fr_0.6fr_0.6fr_auto]">
                <div>
                  <label
                    htmlFor={`ingredient-name-${row.id}`}
                    className={labelEmeralClass}
                  >
                    Zutat {index + 1}
                  </label>
                  <FilterCombobox
                    options={ingredientNames}
                    value={row.name}
                    onChange={(value) => updateIngredientName(row.id, value)}
                    onAdd={(value) => updateIngredientName(row.id, value)}
                    name="ingredientName"
                    inputId={`ingredient-name-${row.id}`}
                    placeholder="z. B. Tomate"
                  />
                </div>

                <div>
                  <label
                    htmlFor={`ingredient-amount-${row.id}`}
                    className={labelEmeralClass}
                  >
                    Menge
                  </label>
                  <input
                    id={`ingredient-amount-${row.id}`}
                    name="ingredientAmount"
                    type="number"
                    min="0"
                    step="0.1"
                    className={emeralInputClass}
                    placeholder="2"
                  />
                </div>

                <div>
                  <label
                    htmlFor={`ingredient-unit-${row.id}`}
                    className={labelEmeralClass}
                  >
                    Einheit
                  </label>
                  <FilterCombobox
                    options={unitNames}
                    value={row.unit}
                    onChange={(value) => updateIngredientUnit(row.id, value)}
                    onAdd={(value) => updateIngredientUnit(row.id, value)}
                    name="ingredientUnit"
                    inputId={`ingredient-unit-${row.id}`}
                    placeholder="z. B. Stk."
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => removeIngredientRow(row.id)}
                    disabled={ingredientRows.length === 1}
                    className={secondaryButton}
                  >
                    Entfernen
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor={`ingredient-notes-${row.id}`}
                  className={labelEmeralClass}
                >
                  Notiz (optional)
                </label>
                <input
                  id={`ingredient-notes-${row.id}`}
                  name="ingredientNotes"
                  className={emeralInputClass}
                  maxLength={120}
                  placeholder='z. B. "fein gehackt"'
                />
              </div>
            </div>
          ))}
        </div>

        <ErrorText messages={state.errors?.ingredients} />
      </div>

      <label className="inline-flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
        <input
          type="checkbox"
          name="isPublic"
          className="size-4 rounded border-neutral-300"
        />
        Rezept öffentlich sichtbar machen
      </label>

      {state.message ? (
        <p
          role="status"
          className={
            state.success
              ? "text-sm text-emerald-700 dark:text-emerald-400"
              : "text-sm text-red-600 dark:text-red-400"
          }
        >
          {state.message}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button type="reset" className={secondaryButton} disabled={pending}>
          Zurücksetzen
        </button>
        <button type="submit" className={emeraldButton} disabled={pending}>
          {pending ? "Rezept wird gespeichert…" : "Rezept speichern"}
        </button>
      </div>
    </form>
  );
}
