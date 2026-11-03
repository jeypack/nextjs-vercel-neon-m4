"use client";

import {useModal} from "@/app/_context/ModalContext";
import LoginPrompt from "@/app/user/_components/LoginPrompt";
import {primaryButton} from "@/app/_lib/tailwind";

export default function LoginButton() {
  const {open} = useModal();

  return (
    <button
      type="button"
      className={primaryButton + " w-full sm:w-auto flex items-center justify-center"}
      onClick={() => open("Anmelden", <LoginPrompt />)}
    >
      Anmelden <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-letter-o preview-icon inline"><circle cx="12" cy="12" r="3"/></svg> Registrieren
    </button>
  );
}
