import {redirect} from "next/navigation";
import Link from "next/link";
import {getCurrentUser} from "@/lib/auth/session";
import ProfileForm from "@/app/user/_components/ProfileForm";
import DeleteAccountForm from "@/app/user/_components/DeleteAccountForm";
import ProfileImageForm from "@/app/user/_components/ProfileImageForm";

export const metadata = {
  title: "Profil bearbeiten",
  description: "Verwalte deine persönlichen Kontodaten",
};

export default async function Page() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/user");
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <Link
        href="/user"
        className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
      >
        ← Zurück zum Benutzerbereich
      </Link>

      <h1 className="mt-6 text-3xl font-bold tracking-tight">
        Profil bearbeiten
      </h1>

      <p className="mt-2 text-gray-600 dark:text-gray-400">
        Verwalte deine persönlichen Kontodaten.
      </p>

      <ProfileForm user={user} />

      <ProfileImageForm user={user} />

      <DeleteAccountForm />
    </main>
  );
}
