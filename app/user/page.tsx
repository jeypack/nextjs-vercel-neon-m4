import {getCurrentUser} from "@/lib/auth/session";
import {Role} from "@/lib/generated/prisma/client";
import {getUsers} from "@/app/user/_lib/actions";
import AuthTabs from "@/app/user/_components/AuthTabs";
import UserList from "@/app/user/_components/UserList";
import UserCard from "@/app/user/_components/UserCard";
import Chip from "@/app/_components/Chip";
import {UserRoundCog} from "lucide-react";
import ProfileForm from "@/app/user/_components/ProfileForm";
import DeleteAccountForm from "@/app/user/_components/DeleteAccountForm";
import ProfileImageForm from "@/app/user/_components/ProfileImageForm";

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
        {/* <Chip>
          <UserRoundCog className="size-4" />
          Userverwaltung
        </Chip>
        <p className="mb-2 text-sm font-medium uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
          User
        </p> */}

        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-4xl">
          {user ? "Dein Benutzerkonto" : "Willkommen"}
        </h1>

        <p className="mt-3 max-w-2xl text-neutral-600 dark:text-neutral-400">
          {user
            ? "Verwalte deine persönlichen Daten und Einstellungen."
            : "Registriere dich oder melde dich mit deinem bestehenden Konto an."}
        </p>
      </div>

      {!user ? (
        <AuthTabs defaultIndex={1} />
      ) : (
        <div className="space-y-8">
          {/* <UserCard user={user} /> */}

          <ProfileImageForm user={user} />

          <ProfileForm user={user} />

          <DeleteAccountForm />

          {user.role === Role.ADMIN && (
            <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-900 sm:p-8">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                  Benutzerverwaltung
                </h2>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                  Benutzer anzeigen und verwalten.
                </p>
              </div>
              <UserList
                isAdmin={user.email === "admin2014@gmail.com"}
                users={users}
              />
            </section>
          )}
        </div>
      )}
    </main>
  );
}
