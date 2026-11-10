"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  ChefHat,
  CookingPot,
  Refrigerator,
  ShoppingBasket,
} from "lucide-react";
import {useModal} from "@/app/_context/ModalContext";
import LoginPrompt from "@/app/user/_components/LoginPrompt";

interface GuestDashboardProps {
  recipeCount: number | null;
}

export default function GuestDashboard({recipeCount}: GuestDashboardProps) {
  const {open} = useModal();

  const features = [
    {
      id: 0,
      title: "Mein Vorrat",
      description:
        "Verwalte deine Zutaten, behalte Mengen und Mindesthaltbarkeitsdaten im Blick und vermeide unnötige Lebensmittelverschwendung.",
      href: "/",
      icon: Refrigerator,
    },
    {
      id: 1,
      title: "Rezepte entdecken",
      description:
        "Entdecke neue Gerichte, durchsuche Rezepte nach Kategorien und finde Inspiration für deine nächste Mahlzeit.",
      href: "/recipes",
      count: recipeCount,
      icon: CookingPot,
    },
    {
      id: 2,
      title: "Meine Einkaufsliste",
      description:
        "Sammle fehlende Zutaten und behalte den Überblick über alles, was du für deine nächsten Gerichte benötigst.",
      href: "/",
      icon: ShoppingBasket,
    },
    {
      id: 3,
      title: "Mein Wochenplan",
      description:
        "Plane deine Mahlzeiten im Voraus und behalte den Überblick über deine geplanten Gerichte.",
      href: "/",
      icon: CalendarDays,
    },
  ];

  const handleClick = (id: number) => {
    console.log(`Feature with id ${id} clicked`);
    switch (id) {
      case 0:
      // Handle "Mein Vorrat" click
      case 2:
      // Handle "Meine Einkaufsliste" click
      case 3:
        // Handle "Mein Wochenplan" click
        open("Anmelden", <LoginPrompt />);
        break;
      default:
        break;
    }
  };

  return (
    <section className="mb-12">
      <div className="p-4">
        <h2 className="text-xl font-bold">Willkommen!</h2>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          Bitte melde dich an, um auf alle Funktionen zuzugreifen.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <Link
              key={feature.id}
              href={feature.href}
              onClick={() => handleClick(feature.id)}
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
              <div className="flex items-center justify-between">
                <div className="flex size-10 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
                  <Icon size={21} aria-hidden="true" />
                </div>
                {feature.count !== undefined && feature.count !== 0 && (
                  <span className="text-sm text-neutral-500 dark:text-neutral-400">
                    {feature.count}{" "}
                    {feature.id === 1
                      ? feature.count === 1
                        ? "Gericht"
                        : "Gerichte"
                      : ""}
                  </span>
                )}
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
      </div>
    </section>
  );
}
