"use client";

import {useActionState, useEffect, useState} from "react";
import FilterCombobox from "@/app/_components/FilterCombobox";
import {PACKAGE_SIZE_UNITS, PANTRY_UNITS} from "@/app/_lib/units";
import {
  emeraldButton,
  inputClass,
  labelClass,
  neutralButton,
} from "@/app/_lib/tailwind";
import {deletePantryItem, updatePantryItem} from "@/app/pantry/_lib/actions";
import type {PantryFormState, PantryListItem} from "@/app/pantry/_lib/types";
import {Pencil, Trash2} from "lucide-react";
import {useModal} from "@/app/_context/ModalContext";
import DeletePantryDialog from "@/app/pantry/_components/DeletePantryDialog";

const initialState: PantryFormState = {};

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

export default function PantryItemActions({item}: {item: PantryListItem}) {
  const {open, close} = useModal();
  const [isEditing, setIsEditing] = useState(false);
  const [unitInput, setUnitInput] = useState(item.unit ?? "");
  const [packageUnitInput, setPackageUnitInput] = useState(
    item.packageUnit ?? "",
  );

  const [updateState, updateAction, updatePending] = useActionState(
    updatePantryItem,
    initialState,
  );
  const [deleteState, deleteAction, deletePending] = useActionState(
    deletePantryItem,
    initialState,
  );

  useEffect(() => {
    if (updateState.success) {
      setIsEditing(false);
    }
  }, [updateState.success]);

  const busy = updatePending || deletePending;

  if (!isEditing) {
    return (
      <div className="mt-4 sm:mt-0 flex justify-start sm:justify-around sm:flex-wrap gap-2 w-full">
        <button
          type="button"
          aria-label="Vorrat bearbeiten"
          title="Bearbeiten"
          className="cursor-pointer rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900"
          onClick={() => setIsEditing(true)}
          disabled={busy}
        >
          <Pencil className="size-4" />
        </button>

        <form action={deleteAction}>
          <input type="hidden" name="id" value={item.id} />
          <button
            type="button"
            aria-label="Vorrat löschen"
            title="Löschen"
            className="cursor-pointer rounded-md p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
            onClick={() =>
              open(
                "Vorrat löschen: " + item.ingredientName,
                <DeletePantryDialog itemId={item.id} onCancel={close} />,
              )
            }
          >
            <Trash2 className="size-4" />
          </button>
        </form>

        {deleteState.message ? (
          <p
            className={
              deleteState.success
                ? "text-sm text-emerald-700 dark:text-emerald-400"
                : "text-sm text-red-600 dark:text-red-400"
            }
            role="status"
          >
            {deleteState.message}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <form
      action={updateAction}
      className="mt-4 space-y-4 rounded-xl border border-neutral-200 p-4 dark:border-neutral-700"
    >
      <input type="hidden" name="id" value={item.id} />

      <div>
        <label className={labelClass}>Zutat</label>
        <input
          type="text"
          value={item.ingredientName}
          readOnly
          className={`${inputClass} opacity-80`}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`quantity-${item.id}`} className={labelClass}>
            Menge
          </label>
          <input
            id={`quantity-${item.id}`}
            name="quantity"
            type="number"
            min="0"
            step="0.1"
            defaultValue={item.quantity ?? ""}
            className={inputClass}
            disabled={busy}
          />
          <ErrorText messages={updateState.errors?.quantity} />
        </div>

        <div>
          <label htmlFor={`unit-${item.id}`} className={labelClass}>
            Einheit
          </label>
          <FilterCombobox
            options={[...PANTRY_UNITS]}
            value={unitInput}
            onChange={setUnitInput}
            onAdd={setUnitInput}
            name="unit"
            inputId={`unit-${item.id}`}
            editable={false}
            placeholder="Einheit auswählen"
          />
          <ErrorText messages={updateState.errors?.unit} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`package-size-${item.id}`} className={labelClass}>
            Packungsgröße
          </label>
          <input
            id={`package-size-${item.id}`}
            name="packageSize"
            type="number"
            min="0"
            step="0.1"
            defaultValue={item.packageSize ?? ""}
            className={inputClass}
            disabled={busy}
          />
          <ErrorText messages={updateState.errors?.packageSize} />
        </div>

        <div>
          <label htmlFor={`package-unit-${item.id}`} className={labelClass}>
            Packungseinheit
          </label>
          <FilterCombobox
            options={[...PACKAGE_SIZE_UNITS]}
            value={packageUnitInput}
            onChange={setPackageUnitInput}
            onAdd={setPackageUnitInput}
            name="packageUnit"
            inputId={`package-unit-${item.id}`}
            editable={false}
            placeholder="z. B. g oder ml"
          />
          <ErrorText messages={updateState.errors?.packageUnit} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`expires-at-${item.id}`} className={labelClass}>
            Ablaufdatum
          </label>
          <input
            id={`expires-at-${item.id}`}
            name="expiresAt"
            type="date"
            defaultValue={
              item.expiresAt
                ? new Date(item.expiresAt).toISOString().slice(0, 10)
                : ""
            }
            className={inputClass}
            disabled={busy}
          />
          <ErrorText messages={updateState.errors?.expiresAt} />
        </div>

        <div>
          <label htmlFor={`notes-${item.id}`} className={labelClass}>
            Notiz
          </label>
          <input
            id={`notes-${item.id}`}
            name="notes"
            type="text"
            defaultValue={item.notes ?? ""}
            className={inputClass}
            disabled={busy}
          />
          <ErrorText messages={updateState.errors?.notes} />
        </div>
      </div>

      {updateState.message ? (
        <p
          className={
            updateState.success
              ? "text-sm text-emerald-700 dark:text-emerald-400"
              : "text-sm text-red-600 dark:text-red-400"
          }
          role="status"
        >
          {updateState.message}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={neutralButton}
          onClick={() => {
            setIsEditing(false);
            setUnitInput(item.unit ?? "");
            setPackageUnitInput(item.packageUnit ?? "");
          }}
          disabled={busy}
        >
          Abbrechen
        </button>
        <button type="submit" className={emeraldButton} disabled={busy}>
          {updatePending ? "Speichert …" : "Speichern"}
        </button>
      </div>
    </form>
  );
}
