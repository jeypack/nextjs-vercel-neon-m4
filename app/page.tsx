import Link from "next/link";
import argon2 from "argon2";
import {
  ArrowRight,
  CalendarDays,
  ChefHat,
  ClipboardList,
  CookingPot,
  Leaf,
  Plus,
  Refrigerator,
  Search,
  ShoppingBasket,
  Sparkles,
} from "lucide-react";

const features = [
  {
    title: "Rezepte entdecken",
    description: "Rezepte durchsuchen, filtern und eigene Gerichte verwalten.",
    href: "/recipes",
    icon: CookingPot,
  },
  {
    title: "Mit Vorräten kochen",
    description: "Finde Rezepte, die zu deinen vorhandenen Zutaten passen.",
    href: "/cook",
    icon: ChefHat,
  },
  {
    title: "Vorrat verwalten",
    description: "Behalte deine Zutaten und deren Ablaufdaten im Blick.",
    href: "/pantry",
    icon: Refrigerator,
  },
  {
    title: "Wochenplan",
    description: "Plane Frühstück, Mittag- und Abendessen im Voraus.",
    href: "/meal-plan",
    icon: CalendarDays,
  },
  {
    title: "Einkaufsliste",
    description: "Stelle fehlende Zutaten für deine Gerichte zusammen.",
    href: "/shopping-list",
    icon: ShoppingBasket,
  },
];

export default async function HomePage() {
  /* const SECRET: string = process.env.ARGON2_SECRET ?? "";
  if (SECRET) {
    console.log("ARGON2_SECRET:", SECRET);
    //const secret = Buffer.from(SECRET);
    //console.log("Secret Buffer:", secret);
    //
    const hash = await argon2.hash("undWiedaEins23", { secret: Buffer.from(SECRET) });
    console.log("Hash:", hash);
    const isValid = await argon2.verify(hash, "undWiedaEins23", { secret: Buffer.from(SECRET) });
    console.log("Is valid:", isValid);
    //$argon2id$v=19$m=65536,p=4,t=3$qicBD8dHUjr+YXRa3nWRJQ$+3mFylSm22uAefPEWq9N3vz/uQCIaVMfmGkNCEMBsvk
    //$argon2id$v=19$m=65536,p=4,t=3$ie9t6a2V7qhqyiObRwN8Hw$X28WqZrcbmYjzwT0M6CeVju5Ir2FuxfwY2mvyxUw3eY
  } else {
    console.error("ARGON2_SECRET is not defined");
  } */

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Welcome */}
      <section className="mb-10">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300">
          <Leaf size={16} aria-hidden="true" />
          Bewusst kochen. Weniger verschwenden.
        </div>

        <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-neutral-950 dark:text-neutral-50 sm:text-4xl">
          Was kochen wir heute?
        </h1>

        <p className="mt-3 max-w-2xl text-base leading-7 text-neutral-600 dark:text-neutral-400">
          Entdecke passende Rezepte, verwende deine Vorräte und plane deine
          Mahlzeiten. So machst du aus vorhandenen Zutaten leckere Gerichte.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/cook"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500"
          >
            <Search size={18} aria-hidden="true" />
            Rezept finden
            <ArrowRight size={16} aria-hidden="true" />
          </Link>

          <Link
            href="/pantry"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-white px-5 py-3 text-sm font-semibold text-neutral-800 transition hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
          >
            <Plus size={18} aria-hidden="true" />
            Vorrat verwalten
          </Link>
        </div>
      </section>

      {/* Leftover cooking */}
      <section className="mb-12">
        <Link
          href="/cook"
          className="group flex flex-col justify-between gap-5 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 transition hover:border-emerald-400 sm:flex-row sm:items-center sm:p-7 dark:border-emerald-900 dark:bg-emerald-950/30 dark:hover:border-emerald-700"
        >
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300">
              <Sparkles size={24} aria-hidden="true" />
            </div>

            <div>
              <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                Weniger Lebensmittel verschwenden
              </p>
              <h2 className="mt-1 text-xl font-bold text-neutral-950 dark:text-neutral-50">
                Was steckt noch im Kühlschrank?
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                Gib deine verfügbaren Zutaten ein und finde heraus, welche
                Gerichte du damit zubereiten kannst.
              </p>
            </div>
          </div>

          <span className="inline-flex shrink-0 items-center gap-2 self-start text-sm font-semibold text-emerald-800 sm:self-center dark:text-emerald-300">
            Zutaten eingeben
            <ArrowRight
              size={18}
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-1"
            />
          </span>
        </Link>
      </section>

      {/* Main features */}
      <section className="mb-12">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-neutral-950 dark:text-neutral-50">
              Dein Küchenbereich
            </h2>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
              Alles für deine tägliche Küchenplanung.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <Link
                key={feature.href}
                href={feature.href}
                className="group flex min-h-44 flex-col rounded-xl border border-neutral-200 bg-white p-5 transition hover:border-emerald-400 hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-emerald-800"
              >
                <div className="flex items-center justify-between">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
                    <Icon size={21} aria-hidden="true" />
                  </div>

                  <ArrowRight
                    size={18}
                    aria-hidden="true"
                    className="text-neutral-400 transition group-hover:translate-x-1 group-hover:text-emerald-700 dark:group-hover:text-emerald-400"
                  />
                </div>

                <h3 className="mt-4 font-semibold text-neutral-950 dark:text-neutral-50">
                  {feature.title}
                </h3>

                <p className="mt-1 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                  {feature.description}
                </p>
              </Link>
            );
          })}

          {/* Create recipe */}
          <Link
            href="/recipes/new"
            className="group flex min-h-44 flex-col justify-center rounded-xl border border-dashed border-neutral-300 p-5 transition hover:border-emerald-500 hover:bg-emerald-50/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 dark:border-neutral-700 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/20"
          >
            <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300">
              <Plus size={22} aria-hidden="true" />
            </div>

            <h3 className="mt-4 font-semibold text-neutral-950 dark:text-neutral-50">
              Eigenes Rezept erstellen
            </h3>

            <p className="mt-1 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
              Halte deine Lieblingsgerichte und Zutaten fest.
            </p>
          </Link>
        </div>
      </section>

      {/* Planning shortcut */}
      <section className="rounded-xl border border-neutral-200 bg-white p-5 sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-6 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-start gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
            <ClipboardList size={22} aria-hidden="true" />
          </div>

          <div>
            <h2 className="font-semibold text-neutral-950 dark:text-neutral-50">
              Schon für die Woche geplant?
            </h2>
            <p className="mt-1 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
              Plane deine Mahlzeiten und leite daraus deine Einkaufsliste ab.
            </p>
          </div>
        </div>

        <Link
          href="/meal-plan"
          className="mt-4 inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-emerald-800 hover:text-emerald-900 sm:mt-0 dark:text-emerald-300 dark:hover:text-emerald-200"
        >
          Wochenplan öffnen
          <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </section>
    </main>
  );
}
