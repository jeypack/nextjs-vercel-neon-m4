import {panelClass, softCardClass} from "@/app/_lib/tailwind";
import PantryItemActions from "@/app/pantry/_components/PantryItemActions";
import type {PantryListItem} from "@/app/pantry/_lib/types";

const oneDayMs = 24 * 60 * 60 * 1000;

function formatDate(date: Date | null) {
  if (!date) {
    return "Kein Ablaufdatum";
  }

  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function getExpiryState(expiresAt: Date | null) {
  if (!expiresAt) {
    return {
      label: "Kein Ablaufdatum",
      tone: "text-neutral-600 dark:text-neutral-300",
    };
  }

  const diffDays = Math.ceil(
    (new Date(expiresAt).getTime() - Date.now()) / oneDayMs,
  );

  if (diffDays <= 2) {
    return {
      label: `Läuft in ${diffDays} Tag${diffDays === 1 ? "" : "en"} ab`,
      tone: "text-red-600 dark:text-red-400",
    };
  }

  if (diffDays <= 7) {
    return {
      label: `Läuft am ${formatDate(expiresAt)} ab`,
      tone: "text-amber-600 dark:text-amber-400",
    };
  }

  return {
    label: `Bis ${formatDate(expiresAt)}`,
    tone: "text-emerald-700 dark:text-emerald-400",
  };
}

export default function PantryList({items}: {items: PantryListItem[]}) {
  if (items.length === 0) {
    return (
      <div className={`${panelClass} p-6 sm:p-8`}>
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
              Vorrat
            </p>
            <h2 className="mt-2 text-2xl font-bold text-neutral-900 dark:text-white">
              Noch nichts eingelagert
            </h2>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-6 text-sm text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800/70 dark:text-neutral-300">
          Dein Vorrat ist leer. Füge erst einmal Zutaten hinzu, damit du beim
          Kochen besser planen kannst.
        </div>
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {items.map((item) => {
        const quantityLabel = [item.quantity, item.unit]
          .filter(
            (value): value is string | number =>
              value !== null && value !== undefined && value !== "",
          )
          .map(String)
          .join(" ")
          .trim();
        const packageLabel = [item.packageSize, item.packageUnit]
          .filter(
            (value): value is string | number =>
              value !== null && value !== undefined && value !== "",
          )
          .map(String)
          .join(" ")
          .trim();
        const expiry = getExpiryState(item.expiresAt);

        return (
          <li key={item.id} className={`${panelClass} p-4 sm:p-5`}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                    {item.ingredientName}
                  </h3>
                  {item.notes ? (
                    <span className="rounded-full border border-neutral-200 bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                      {item.notes}
                    </span>
                  ) : null}
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
                  {quantityLabel ? (
                    <span className={`${softCardClass} px-2.5 py-1`}>
                      {quantityLabel}
                    </span>
                  ) : null}
                  {packageLabel ? (
                    <span className={`${softCardClass} px-2.5 py-1`}>
                      Packung: {packageLabel}
                    </span>
                  ) : null}
                  <span className={`font-medium ${expiry.tone}`}>
                    {expiry.label}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between sm:flex-row gap-2">
                <PantryItemActions item={item} />
                <div className="text-left text-sm text-neutral-500 dark:text-neutral-400 sm:text-right">
                  <p>hinzugefügt</p>
                  <p className="mt-1 font-medium text-neutral-700 dark:text-neutral-200">
                    {new Intl.DateTimeFormat("de-DE", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    }).format(item.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
