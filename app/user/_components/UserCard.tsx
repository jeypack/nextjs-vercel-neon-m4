import type {UserItem} from "@/app/user/_lib/types";
import {Role} from "@/lib/generated/prisma/client";
import {logout} from "@/lib/auth/actions";
import Link from "next/link";
import {primaryButton, inputClass, tabClass, labelClass, secondaryButton} from "@/app/_lib/tailwind";

export default function UserCard({user}: {user: UserItem}) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900 sm:p-8 sm:min-w-xl">
      <div className="mb-6 flex justify-between items-center gap-4">
        <div className="flex">
          <div className="flex size-14 mr-4 items-center justify-center rounded-full bg-gray-100 text-xl font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-200">
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
        </div>
        <div className="flex flex-col justify-between items-center gap-4">
          {user.role === Role.ADMIN && (
            <span className="ml-auto rounded-full border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 dark:border-gray-600 dark:text-gray-200">
              Admin
            </span>
          )}
        </div>
      </div>

      {/* Hier später dein Profilformular einbinden. */}
      <div className="flex justify-between items-end gap-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Hier kannst du deine Kontodaten bearbeiten.
        </p>
        <Link href="/user/profile" className={primaryButton}>
          Profil bearbeiten
        </Link>
        <form action={logout}>
            <button
              type="submit"
              className={secondaryButton}
            >
              Logout
            </button>
          </form>
      </div>
    </section>
  );
}
