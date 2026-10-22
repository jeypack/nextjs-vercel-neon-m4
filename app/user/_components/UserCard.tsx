import type {UserItem} from "@/app/user/_lib/types";
import {Role} from "@/lib/generated/prisma/client";
import {logout} from "@/lib/auth/actions";
import Link from "next/link";
import {primaryButton, secondaryButton} from "@/app/_lib/tailwind";
import Avatar from "./Avatar";
import Badge from "@/app/_components/Badge";

export default function UserCard({user}: {user: UserItem}) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900 sm:p-8 sm:min-w-xl">
      <div className="mb-6 flex justify-between items-center gap-4">
        <div className="flex">
          <Avatar user={user} />
          <div className="ml-4">
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
          {user.role === Role.ADMIN && <Badge>Admin</Badge>}
        </div>
      </div>

      <div className="flex justify-between items-end gap-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Hier kannst du deine Kontodaten bearbeiten.
        </p>
        <div className="flex flex-row gap-2">
          <Link href="/user/profile" className={primaryButton}>
            Profil
          </Link>
          <form action={logout}>
            <button type="submit" className={secondaryButton}>
              Logout
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
