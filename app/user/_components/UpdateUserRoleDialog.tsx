"use client";

import {useState} from "react";
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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
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
      <p className="mt-4 text-sm text-gray-700 dark:text-gray-300">
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
          className="cursor-pointer rounded bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 focus:not-data-focus:outline-none focus:outline focus:outline-white disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-800"
          onClick={onCancel}
        >
          Abbrechen
        </button>

        <button
          type="submit"
          disabled={isPending || role === currentRole}
          className="cursor-pointer rounded bg-blue-800 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Speichern …" : "Speichern"}
        </button>
      </div>
    </form>
  );
}
