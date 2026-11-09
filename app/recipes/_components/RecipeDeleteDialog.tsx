"use client";

import {useActionState} from "react";
import {useRouter} from "next/navigation";
import {neutralButton, dangerButton} from "@/app/_lib/tailwind";
import {deleteRecipe} from "@/app/recipes/_lib/actions";
//import {useModal} from "@/app/_context/ModalContext";
import type {RecipeCreateFormState} from "@/app/recipes/_lib/types";

const initialState: RecipeCreateFormState = {};

type Props = {
  recipeId: number;
  onCancel: () => void;
};

export default function RecipeDeleteDialog({onCancel, recipeId}: Props) {
  const router = useRouter();
  //const {setToastMessage} = useModal();
  const [deleteState, deleteAction, deletePending] = useActionState(
    deleteRecipe,
    initialState,
  );

  /* const handleSubmit = () => {
    setToastMessage("Rezept wird gelöscht …");
  }; */

  /* useEffect(() => {
    if (!deleteState.success) {
      return;
    }

    setToastMessage(deleteState.message ?? "Rezept erfolgreich gelöscht.");
    router.push(deleteState.redirectTo ?? "/recipes");
    onCancel();
  }, [deleteState.success, deleteState.redirectTo, deleteState.message, router, setToastMessage]); */

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm mt-4 text-neutral-700 dark:text-neutral-300">
        Möchtest du wirklich dieses Rezept löschen?
      </p>

      <div className="mt-4 flex justify-end items-center gap-2">
        <button type="button" className={neutralButton} onClick={onCancel}>
          Abbrechen
        </button>

        <form action={deleteAction} onSubmit={onCancel}>
          <input type="hidden" name="recipeId" value={recipeId} />

          <button
            type="submit"
            aria-label="Rezept löschen"
            className={dangerButton}
            disabled={deletePending}
          >
            {deletePending ? "…" : "Löschen"}
          </button>
        </form>
        {deleteState.message ? (
          <p
            role="status"
            className={
              deleteState.success
                ? "text-sm text-emerald-700 dark:text-emerald-400"
                : "text-sm text-red-600 dark:text-red-400"
            }
          >
            {deleteState.message}
          </p>
        ) : null}
      </div>
    </div>
  );
}
