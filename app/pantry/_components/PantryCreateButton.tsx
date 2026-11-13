"use client";

import {useState} from "react";
import {Plus, Minus} from "lucide-react";
import {useModal} from "@/app/_context/ModalContext";
import CreatePantryDialog from "@/app/pantry/_components/CreatePantryDialog";

export default function PantryCreateButton({
  ingredientNames,
}: {
  ingredientNames: string[];
}) {
  //const [isOpen, setIsOpen] = useState(false);
  const {open, close, isVisible} = useModal();

  const handleCancel = () => {
    //setIsOpen(false);
    close();
  };

  const handleToggle = () => {
    //setIsOpen(!isOpen);
    open(
      "Neuer Eintrag",
      <CreatePantryDialog ingredientNames={ingredientNames} onCancel={handleCancel} />,
    );
  };

  return (
    <nav className="flex flex-col justify-center items-center gap-4">
      <section
        className={`rounded-3xl border border-emerald-200 bg-emerald-50/70 shadow-sm dark:border-emerald-900 dark:bg-emerald-950/50 mb-3 p-4 w-fit fixed top-auto bottom-6 backdrop-blur-2xl`}
      >
        <div className="flex items-center justify-between">
          <p className="text-sm mr-2 font-medium uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400">
            Neue Zutat
          </p>
          <button
            type="button"
            onClick={handleToggle}
            className="cursor-pointer rounded-full bg-emerald-100 p-2 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-900 dark:text-emerald-300 dark:hover:bg-emerald-800"
          >
            {isVisible ? <Minus /> : <Plus />}
          </button>
        </div>
      </section>
    </nav>
  );
}
