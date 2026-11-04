"use client";

import {useModal} from "@/app/_context/ModalContext";
import LoginPrompt from "@/app/user/_components/LoginPrompt";
import {primaryButton} from "@/app/_lib/tailwind";

interface LoginButtonProps {
  defaultIndex?: number;
  className?: string;
  children?: React.ReactNode;
  label?: string;
}

export default function LoginButton({
  defaultIndex = 1,
  className,
  children,
  label,
}: LoginButtonProps) {
  const {open} = useModal();
  label = label ?? "Anmelden - Registrieren";
  const btnClass =
    (className ?? primaryButton) +
    " w-full sm:w-auto flex items-center justify-center text-nowrap";

  return (
    <button
      type="button"
      className={btnClass}
      onClick={() => open(label, <LoginPrompt defaultIndex={defaultIndex} />)}
    >
      {children ?? label}
    </button>
  );
}
