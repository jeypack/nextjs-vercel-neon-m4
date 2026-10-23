type Props = {
  ingredients: string[];
  onRemove: (ingredient: string) => void;
};

export default function IngredientChips({ingredients, onRemove}: Props) {
  if (ingredients.length === 0) {
    return null;
  }

  return (
    <ul className="flex flex-wrap gap-2">
      {ingredients.map((ingredient) => (
        <li key={ingredient}>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
            {ingredient}

            <button
              type="button"
              onClick={() => onRemove(ingredient)}
              aria-label={`${ingredient} entfernen`}
              className="rounded-full px-1 font-semibold hover:bg-emerald-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 dark:hover:bg-emerald-900"
            >
              ×
            </button>
          </span>
        </li>
      ))}
    </ul>
  );
}
