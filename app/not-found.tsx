// app/not-found.tsx
//"use client";

//import {usePathname} from "next/navigation";
import Link from "next/link";

export const metadata = {
  title: "Page Not Found",
  description: "The requested page could not be found",
};

export default function NotFound() {
  //const pathname = usePathname();
  //console.log("Nicht gefundene Seite:", pathname);
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-8 py-10 w-full bg-white dark:bg-black">
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <h2 className="text-xl mb-2">Seite nicht gefunden</h2>
      <p>Die Route existiert leider nicht.</p>
      <Link href="/" className="text-blue-500 underline mt-4 inline-block">
        Zurück zur Startseite
      </Link>
    </main>
  );
}
{
  /* <code className="border border-gray-500 p-1 rounded">{pathname}</code> */
}
