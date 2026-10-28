import Link from "next/link";

export default function CategoryFilter({
  categoryFilterItems,
  filters,
  makeFilterHref,
}: {
  categoryFilterItems: {slug: string; name: string}[];
  filters: {categorySlug: string};
  makeFilterHref: (nextFilters: {categorySlug: string}) => string;
}) {
  return (
    <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
      {categoryFilterItems.map((category) => (
        <Link
          key={category.slug}
          href={makeFilterHref({categorySlug: category.slug})}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
            filters.categorySlug === category.slug
              ? "bg-emerald-600 text-white"
              : "border border-neutral-200 text-neutral-600 hover:border-emerald-600 hover:text-emerald-700 dark:border-neutral-700 dark:text-neutral-300 dark:hover:text-emerald-400"
          }`}
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
}
