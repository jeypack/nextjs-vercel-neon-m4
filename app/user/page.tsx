import {getCurrentUser} from "@/lib/auth/session";
import {Role} from "@/lib/generated/prisma/client";
import {getUsers} from "@/app/user/_lib/actions";
import AuthTabs from "@/app/user/_components/AuthTabs";
import UserList from "@/app/user/_components/UserList";
import UserCard from "@/app/user/_components/UserCard";

export const metadata = {
  title: "Benutzerverwaltung",
  description: "Verwalte Benutzerkonten und deren Berechtigungen",
};

export default async function Page() {
  const user = await getCurrentUser();
  const users = await getUsers();

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
      <div className="mb-8">
        <p className="mb-2 text-sm font-medium uppercase tracking-widest text-gray-500 dark:text-gray-400">
          User
        </p>

        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
          {user ? "Dein Benutzerkonto" : "Willkommen"}
        </h1>

        <p className="mt-3 max-w-2xl text-gray-600 dark:text-gray-400">
          {user
            ? "Verwalte deine persönlichen Daten und Einstellungen."
            : "Registriere dich oder melde dich mit deinem bestehenden Konto an."}
        </p>
      </div>

      {!user ? (
        <AuthTabs />
      ) : (
        <div className="space-y-8">
          <UserCard user={user} />

          {user.role === Role.ADMIN && (
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900 sm:p-8">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Benutzerverwaltung
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Benutzer anzeigen und verwalten.
                </p>
              </div>
              <UserList users={users} />
            </section>
          )}
        </div>
      )}
    </main>
  );
}

