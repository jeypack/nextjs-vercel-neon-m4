import Link from "next/link";
import {ArrowLeft} from "lucide-react";

export const metadata = {
  title: "Impressum",
  description: "Impressum und Anbieterkennzeichnung",
};

export default function ImpressumPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition hover:text-emerald-600 dark:text-neutral-400 dark:hover:text-emerald-400"
      >
        <ArrowLeft className="size-4" />
        Zurück zur Startseite
      </Link>

      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-950 dark:text-white sm:text-4xl">
          Impressum
        </h1>
        <p className="mt-3 text-neutral-600 dark:text-neutral-400">
          Angaben gemäß § 5 DDG
        </p>
      </header>

      <div className="space-y-8 text-sm leading-7 text-neutral-700 dark:text-neutral-300">
        <section>
          <h2 className="mb-3 text-lg font-semibold text-neutral-950 dark:text-white">
            Angaben zum Betreiber
          </h2>
          <address className="not-italic">
            Jörg Pfeifer
            <br />
            Straße Hausnummer
            <br />
            45147 Essen
          </address>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-neutral-950 dark:text-white">
            Kontakt
          </h2>
          <p>
            E-Mail:{" "}
            <a
              href="mailto:deine@email.de"
              className="text-emerald-700 hover:underline dark:text-emerald-400"
            >
              deine@email.de
            </a>
            <br />
            Telefon: Telefonnummer
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-neutral-950 dark:text-white">
            Verantwortlich für den Inhalt
          </h2>
          <p>
            Jörg Pfeifer
            <br />
            Straße Hausnummer
            <br />
            45147 Essen
          </p>
        </section>
      </div>
    </main>
  );
}
