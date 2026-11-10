import {
  ArrowRight,
  CalendarDays,
  CookingPot,
  Refrigerator,
  ShoppingBasket,
} from "lucide-react";
import Link from "next/link";

interface PersonalDashboardProps {
  recipeCount: number | null;
  pantryCount: number | null;
  mealCount: number | null;
  shoppingCount: number | null;
}

export default async function PersonalDashboard({
  recipeCount,
  pantryCount,
  mealCount,
  shoppingCount,
}: PersonalDashboardProps) {
  const features = [
    {
      id: 0,
      title: "Rezepte entdecken",
      description:
        "Rezepte durchsuchen, filtern und eigene Gerichte verwalten.",
      href: "/recipes",
      count: recipeCount,
      icon: CookingPot,
    },
    /* {
      id: 1,
      title: "Mit Vorräten kochen",
      description: "Finde Rezepte, die zu deinen vorhandenen Zutaten passen.",
      href: "/cook",
      icon: ChefHat,
    }, */
    {
      id: 2,
      title: "Vorrat verwalten",
      description: "Behalte deine Zutaten und deren Ablaufdaten im Blick.",
      href: "/pantry",
      count: pantryCount,
      icon: Refrigerator,
    },
    {
      id: 3,
      title: "Wochenplan",
      description: "Plane Frühstück, Mittag- und Abendessen im Voraus.",
      href: "/meal-plan",
      count: mealCount,
      icon: CalendarDays,
    },
    {
      id: 4,
      title: "Einkaufsliste",
      description: "Stelle fehlende Zutaten für deine Gerichte zusammen.",
      href: "/shopping-list",
      count: shoppingCount,
      icon: ShoppingBasket,
    },
  ];

  return (
    <section className="mb-12">
      <div className="grid gap-4 sm:grid-cols-2">
        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <Link
              key={feature.id}
              href={feature.href}
              className="group relative flex min-h-33 sm:min-h-52 flex-col justify-between overflow-hidden rounded-xl border border-neutral-200 bg-white p-5 transition hover:border-emerald-400 hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-emerald-800"
            >
              <div className="pointer-events-none absolute inset-y-0 right-0 sm:right-5 flex w-3/5 items-center justify-center overflow-hidden opacity-60 sm:w-1/3">
                <div className="flex h-full w-full items-start justify-center sm:items-center sm:justify-start">
                  <Icon
                    size={200}
                    aria-hidden="true"
                    className="text-emerald-600/15 dark:text-emerald-300/5"
                  />
                </div>
              </div>

              <div className="relative z-10 flex items-center justify-between">
                <div className="flex size-10 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
                  <Icon size={21} aria-hidden="true" />
                </div>
                {feature.count !== null && feature.count !== 0 && (
                  <span className="text-sm text-neutral-500 dark:text-neutral-400">
                    {feature.count}{" "}
                    {feature.id === 0
                      ? "Rezepte"
                      : feature.id === 1
                        ? "Zutaten"
                        : feature.id === 2
                          ? feature.count === 1
                            ? "Zutat"
                            : "Zutaten"
                          : feature.id === 3
                            ? feature.count === 1
                              ? "Gericht"
                              : "Gerichte"
                            : feature.id === 4
                              ? "Artikel"
                              : ""}
                  </span>
                )}
                <ArrowRight
                  size={18}
                  aria-hidden="true"
                  className="text-neutral-400 transition group-hover:translate-x-1 group-hover:text-emerald-700 dark:group-hover:text-emerald-400"
                />
              </div>

              <div className="relative z-10 mt-4">
                <h3 className="font-semibold text-neutral-950 dark:text-neutral-50">
                  {feature.title}
                </h3>

                <p className="mt-1 text-sm leading-6 text-neutral-600 dark:text-neutral-400 hidden sm:block">
                  {feature.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
