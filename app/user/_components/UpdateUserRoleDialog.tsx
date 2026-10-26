"use client";

import {useState} from "react";
import {neutralButton, emeraldButton} from "@/app/_lib/tailwind";
import {updateUserRole} from "@/app/user/_lib/actions";
import UserRoleList from "@/app/user/_components/UserRoleList";
import {Role} from "@/lib/generated/prisma/client";

type Props = {
  userId: number;
  currentRole: Role;
  onCancel: () => void;
};

export default function UpdateUserRoleDialog({
  userId,
  currentRole,
  onCancel,
}: Props) {
  const [role, setRole] = useState<Role>(currentRole);
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsPending(true);

    try {
      const result = await updateUserRole(userId, role);

      if (!result.success) {
        setError(result.message);
        return;
      }

      onCancel();
    } catch {
      setError("Die Rolle konnte nicht aktualisiert werden.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <p className="mt-4 text-sm text-neutral-700 dark:text-neutral-300">
        Wähle die neue Rolle für diesen User.
      </p>

      <UserRoleList defaultValue={currentRole} onChange={setRole} />

      {error && (
        <p role="alert" className="text-sm text-red-700 dark:text-red-400">
          {error}
        </p>
      )}

      <div className="mt-4 flex justify-end gap-2">
        <button
          type="button"
          disabled={isPending}
          className={neutralButton} 
          onClick={onCancel}
        >
          Abbrechen
        </button>

        <button
          type="submit"
          disabled={isPending || role === currentRole}
          className={emeraldButton}
        >
          {isPending ? "Speichern …" : "Speichern"}
        </button>
      </div>
    </form>
  );
}
