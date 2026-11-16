"use client";

import {useModal} from "@/app/_context/ModalContext";
import RecipeDeleteDialog from "@/app/recipes/_components/RecipeDeleteDialog";
import {dangerButton} from "@/app/_lib/tailwind";

interface RecipeDeleteButtonProps {
  className?: string;
  recipeId: number;
  children?: React.ReactNode;
  label?: string;
}

export default function RecipeDeleteButton({
  recipeId,
  label,
  children,
  className,
}: RecipeDeleteButtonProps) {
  const {open, close} = useModal();
  const caption = label ?? "Rezept löschen";
  const btnClass = className ?? dangerButton; 

  return (
    <button
      type="button"
      className={btnClass}
      onClick={() =>
        open(
          caption,
          <RecipeDeleteDialog recipeId={recipeId} onCancel={close} />,
        )
      }
    >
      {children}
    </button>
  );
}
