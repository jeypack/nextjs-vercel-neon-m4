"use client";

import {useActionState, useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import FilterCombobox from "@/app/_components/FilterCombobox";
import ListBox from "@/app/_components/ListBox";
import {updateRecipe} from "@/app/recipes/_lib/actions";
import type {
  RecipeEditFormProps,
  RecipeCreateFormState,
} from "@/app/recipes/_lib/types";
import {
  emeralInputClass,
  emeraldButton,
  labelEmeralClass,
  primaryButton,
  secondaryButton,
} from "@/app/_lib/tailwind";
import RecipeDeleteButton from "@/app/recipes/_components/RecipeDeleteButton";
import {Trash} from "lucide-react";

type IngredientRow = {
  id: string;
  name: string;
  amount: string;
  unit: string;
  notes: string;
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

function buildInitialRows(
  recipe: RecipeEditFormProps["recipe"],
): IngredientRow[] {
  if (recipe.ingredients.length === 0) {
    return [
      {id: "ingredient-row-1", name: "", amount: "", unit: "", notes: ""},
    ];
  }

  return recipe.ingredients.map((ingredient, index) => ({
    id: `ingredient-row-${index + 1}`,
    name: ingredient.name,
    amount: ingredient.amount?.toString() ?? "",
    unit: ingredient.unit ?? "",
    notes: ingredient.notes ?? "",
  }));
}

export default function RecipeEditForm({
  recipe,
  categories,
  ingredientNames,
  unitNames,
}: RecipeEditFormProps) {
  const router = useRouter();
  const [updateState, updateAction, updatePending] = useActionState(
    updateRecipe,
    initialState,
  );
  const [ingredientRows, setIngredientRows] = useState<IngredientRow[]>(
    buildInitialRows(recipe),
  );
  const [nextRowNumber, setNextRowNumber] = useState(ingredientRows.length + 1);
  const [listBoxResetKey, setListBoxResetKey] = useState(0);

  useEffect(() => {
    if (!updateState.success) {
      return;
    }

    router.push(`/recipes/${updateState.recipeId ?? recipe.id}`);
  }, [recipe.id, router, updateState.recipeId, updateState.success]);

  const addIngredientRow = () => {
    setIngredientRows((prevRows) => [
      {
        id: `ingredient-row-${nextRowNumber}`,
        name: "",
        amount: "",
        unit: "",
        notes: "",
      },
      ...prevRows,
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

  const updateIngredientField = (
    rowId: string,
    field: "name" | "amount" | "unit" | "notes",
    value: string,
  ) => {
    setIngredientRows((prevRows) =>
      prevRows.map((row) =>
        row.id === rowId ? {...row, [field]: value} : row,
      ),
    );
  };

  const resetForm = () => {
    setIngredientRows(buildInitialRows(recipe));
    setNextRowNumber(buildInitialRows(recipe).length + 1);
    setListBoxResetKey((current) => current + 1);
  };

  const isBusy = updatePending;

  return (
    <form action={updateAction} onReset={resetForm} className="space-y-5">
      <input type="hidden" name="recipeId" value={recipe.id} />

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
            defaultValue={recipe.title}
            className={emeralInputClass}
            placeholder="z. B. Cremige Tomatenpasta"
          />
          <ErrorText messages={updateState.errors?.title} />
        </div>

        <div>
          <ListBox
            key={`category-${listBoxResetKey}`}
            name="categoryId"
            data={categories}
            label="Kategorie*"
            required={true}
            defaultValue={recipe.categoryId}
          />
          <ErrorText messages={updateState.errors?.categoryId} />
        </div>

        <div>
          <ListBox
            key={`difficulty-${listBoxResetKey}`}
            name="difficulty"
            data={[
              {id: "EASY", name: "Einfach"},
              {id: "MEDIUM", name: "Mittel"},
              {id: "HARD", name: "Anspruchsvoll"},
            ]}
            label="Schwierigkeit*"
            defaultValue={recipe.difficulty}
            required={true}
          />
          <ErrorText messages={updateState.errors?.difficulty} />
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
            defaultValue={recipe.prepTime}
            className={emeralInputClass}
          />
          <ErrorText messages={updateState.errors?.prepTime} />
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
            defaultValue={recipe.servings}
            className={emeralInputClass}
          />
          <ErrorText messages={updateState.errors?.servings} />
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
          defaultValue={recipe.description ?? ""}
          className={`${emeralInputClass} resize-none`}
          placeholder="Optional: Kurze Beschreibung des Rezepts"
        />
        <ErrorText messages={updateState.errors?.description} />
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
          defaultValue={recipe.instructions}
          className={`${emeralInputClass} resize-y`}
          placeholder="Beschreibe die Schritte für die Zubereitung."
        />
        <ErrorText messages={updateState.errors?.instructions} />
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
            disabled={isBusy}
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
                    Zutat {index + 1}{" "}
                    <span className="text-xs text-neutral-500 dark:text-emerald-700">
                      - zur Auswahl tippen…
                    </span>
                  </label>
                  <FilterCombobox
                    options={ingredientNames}
                    value={row.name}
                    onChange={(value) =>
                      updateIngredientField(row.id, "name", value)
                    }
                    onAdd={(value) =>
                      updateIngredientField(row.id, "name", value)
                    }
                    name="ingredientName"
                    inputId={`ingredient-name-${row.id}`}
                    placeholder="z. B. Tomate"
                    selectOnFocus={true}
                  />
                  {updateState.ingredientRowErrors?.[index]?.name ? (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      {updateState.ingredientRowErrors[index]?.name}
                    </p>
                  ) : null}
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
                    value={row.amount}
                    onChange={(event) =>
                      updateIngredientField(
                        row.id,
                        "amount",
                        event.target.value,
                      )
                    }
                    className={emeralInputClass}
                    placeholder="2"
                  />
                  {updateState.ingredientRowErrors?.[index]?.amount ? (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      {updateState.ingredientRowErrors[index]?.amount}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label
                    htmlFor={`ingredient-unit-${row.id}`}
                    className={labelEmeralClass}
                  >
                    Einheit*{" "}
                    <span className="text-xs text-neutral-500 dark:text-emerald-700">
                      - zur Auswahl tippen…
                    </span>
                  </label>
                  <FilterCombobox
                    options={unitNames}
                    value={row.unit}
                    onChange={(value) =>
                      updateIngredientField(row.id, "unit", value)
                    }
                    onAdd={(value) =>
                      updateIngredientField(row.id, "unit", value)
                    }
                    name="ingredientUnit"
                    inputId={`ingredient-unit-${row.id}`}
                    placeholder="Einheit auswählen"
                    allowCustomValue={false}
                    selectOnFocus={true}
                  />
                  {updateState.ingredientRowErrors?.[index]?.unit ? (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      {updateState.ingredientRowErrors[index]?.unit}
                    </p>
                  ) : null}
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => removeIngredientRow(row.id)}
                    disabled={ingredientRows.length === 1 || isBusy}
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
                  value={row.notes}
                  onChange={(event) =>
                    updateIngredientField(row.id, "notes", event.target.value)
                  }
                  className={emeralInputClass}
                  maxLength={120}
                  placeholder='z. B. "fein gehackt"'
                />
                {updateState.ingredientRowErrors?.[index]?.notes ? (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                    {updateState.ingredientRowErrors[index]?.notes}
                  </p>
                ) : null}
              </div>
            </div>
          ))}
        </div>

        <ErrorText messages={updateState.errors?.ingredients} />
      </div>

      <label className="inline-flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
        <input
          type="checkbox"
          name="isPublic"
          defaultChecked={recipe.isPublic}
          className="size-4 rounded border-neutral-300"
        />
        Rezept öffentlich sichtbar machen
      </label>

      {updateState.message ? (
        <p
          role="status"
          className={
            updateState.success
              ? "text-sm text-emerald-700 dark:text-emerald-400"
              : "text-sm text-red-600 dark:text-red-400"
          }
        >
          {updateState.message}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row">
          <button type="reset" className={secondaryButton} disabled={isBusy}>
            Änderungen verwerfen
          </button>
          <button type="submit" className={emeraldButton} disabled={isBusy}>
            {updatePending
              ? "Änderungen werden gespeichert…"
              : "Änderungen speichern"}
          </button>
        </div>
        <RecipeDeleteButton recipeId={recipe.id}>
          <span className="inline-flex justify-center items-center gap-2">
            <Trash size={16} aria-hidden="true" />
            Rezept löschen
          </span>
        </RecipeDeleteButton>
        {/* <button
          type="submit"
          formAction={deleteAction}
          formNoValidate
          className={dangerButton}
          disabled={isBusy}
          onClick={(event) => {
            if (!window.confirm("Möchtest du dieses Rezept wirklich löschen?")) {
              event.preventDefault();
            }
          }}
        >
          {deletePending ? "Rezept wird gelöscht…" : "Rezept löschen"}
        </button>
        <button
          type="button"
          className={dangerButton}
          disabled={isBusy}
          onClick={() =>
            open(
              "Rezept löschen",
              <RecipeDeleteDialog recipeId={recipe.id} onCancel={close} />,
            )
          }
        >
          <span className="inline-flex justify-center items-center gap-2">
            <Trash size={16} aria-hidden="true" />
            Rezept löschen
          </span>
        </button> */}
      </div>
    </form>
  );
}
