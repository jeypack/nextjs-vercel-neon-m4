import Link from "next/link";
import {ChefHat, Heart} from "lucide-react";
import Logo from "@/app/_components/Logo";

const footerLinks = [
  {href: "/cook", label: "Was kann ich kochen?"},
  {href: "/recipes", label: "Rezepte"},
  {href: "/pantry", label: "Vorrat"},
  {href: "/shopping-list", label: "Einkaufsliste"},
  {href: "/meal-plan", label: "Wochenplan"},
  {href: "/impressum", label: "Impressum"},
];

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="inline-flex items-center gap-2 self-start">
            <Logo />
          </Link>

          <nav
            aria-label="Footer-Navigation"
            className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-neutral-600 dark:text-neutral-400"
          >
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition hover:text-emerald-700 dark:hover:text-emerald-400"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-7 flex flex-col gap-3 border-t border-neutral-100 pt-5 text-xs text-neutral-500 dark:border-neutral-800 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Smart Meal Planner</p>

          <p className="inline-flex items-center gap-1.5">
            Mit <Heart className="size-3.5 text-emerald-600" /> entwickelt.
          </p>
        </div>
      </div>
    </footer>
  );
}

/* 
<span className="flex size-9 items-center justify-center rounded-xl bg-emerald-600 text-white">
              <ChefHat className="size-5" />
            </span>
            <span className="text-lg font-bold text-neutral-900 dark:text-white">
              Smart Meal Planner
            </span>
*/