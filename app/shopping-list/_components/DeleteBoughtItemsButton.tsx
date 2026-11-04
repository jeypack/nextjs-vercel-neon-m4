"use client";

import {secondaryButton} from "@/app/_lib/tailwind";
import {Trash} from "lucide-react";
import DeleteBoughtItemsDialog from "@/app/shopping-list/_components/DeleteBoughtItemsDialog";
import {useModal} from "@/app/_context/ModalContext";

export default function DeleteBoughtItemsButton({userId}: {userId: number}) {
  const {open, close} = useModal();
  const label = "Gekaufte Artikel löschen";

  return (
    <button
      type="button"
      className={secondaryButton}
      onClick={() =>
        open(
          label,
          <DeleteBoughtItemsDialog userId={userId} onCancel={close} />,
        )
      }
    >
      <span className="inline-flex justify-center items-center gap-2">
        <Trash size={16} aria-hidden="true" />
        {label}
      </span>
    </button>
  );
}
