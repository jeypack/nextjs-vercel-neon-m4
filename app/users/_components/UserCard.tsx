import type {UserItem} from "@/app/users/_lib/types";
import {Role} from "@/lib/generated/prisma/client";

export default function UserCard({user}: {user: UserItem}) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900 sm:p-8">
      <div className="mb-6 flex items-center gap-4">
        <div className="flex size-14 items-center justify-center rounded-full bg-gray-100 text-xl font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-200">
          {(user.firstName?.[0] ?? user.email[0]).toUpperCase()}
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {[user.firstName, user.lastName].filter(Boolean).join(" ") ||
              "Dein Profil"}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {user.email}
          </p>
        </div>

        {user.role === Role.ADMIN && (
          <span className="ml-auto rounded-full border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 dark:border-gray-600 dark:text-gray-200">
            Admin
          </span>
        )}
      </div>

      {/* Hier später dein Profilformular einbinden. */}
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Hier kannst du deine Kontodaten bearbeiten.
      </p>
    </section>
  );
}
