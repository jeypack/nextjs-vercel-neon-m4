import ShoppingListItemRow from "@/app/shopping-list/_components/ShoppingListItemRow";
import type {ShoppingListItem} from "@/app/shopping-list/_lib/types";
import {panelClass} from "@/app/_lib/tailwind";

type ShoppingListItemsProps = {
  items: ShoppingListItem[];
  hideBought: boolean;
};

export default function ShoppingListItems({
  items,
  hideBought,
}: ShoppingListItemsProps) {
  if (items.length === 0) {
    return (
      <div className={`${panelClass} p-6 sm:p-8`}>
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
          Keine offenen Einkaufsartikel
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-neutral-600 dark:text-neutral-300">
          {hideBought
            ? "Es sind keine offenen Einträge sichtbar. Deaktiviere den Filter oder generiere neue fehlende Zutaten aus deinem Meal-Plan."
            : "Deine Liste ist leer. Generiere fehlende Zutaten direkt aus deinem Meal-Plan."}
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <ShoppingListItemRow key={item.id} item={item} />
      ))}
    </ul>
  );
}
