"use client";

import {Radio, RadioGroup} from "@headlessui/react";
import {Filter, Lock, GlobeCheck} from "lucide-react";
import {useRouter} from "next/navigation";
import type {
  RecipeFilters,
  RecipeVisibilityFilter,
} from "@/app/recipes/_lib/types";
import type {RecipeFiltersFormProps} from "@/app/recipes/_lib/types";
import {panelClass} from "@/app/_lib/tailwind";

const recipeVisibilityOptions: {
  value: RecipeVisibilityFilter;
  label: string;
}[] = [
  {value: "all", label: "Öffentlich + privat"},
  {value: "public", label: "Nur öffentlich"},
  {value: "private", label: "Nur privat"},
];

export default function RecipeFiltersForm({
  filters,
  canViewPrivateRecipes,
}: RecipeFiltersFormProps) {
  const router = useRouter();

  const makeFilterHref = (nextFilters: Partial<RecipeFilters>) => {
    const merged: RecipeFilters = {
      ...filters,
      ...nextFilters,
    };
    const params = new URLSearchParams();

    if (merged.searchQuery) {
      params.set("q", merged.searchQuery);
    }

    if (merged.categorySlug !== "all") {
      params.set("category", merged.categorySlug);
    }

    if (merged.visibility !== "all") {
      params.set("visibility", merged.visibility);
    }

    const query = params.toString();
    return query ? `/recipes?${query}` : "/recipes";
  };

  const handleVisibilityChange = (nextVisibility: RecipeVisibilityFilter) => {
    if (nextVisibility === filters.visibility) {
      return;
    }

    router.push(makeFilterHref({visibility: nextVisibility}), {
      scroll: false,
    });
  };

  const radioClass = "group flex flex-col min-h-10 min-w-13 cursor-pointer items-center justify-center gap-2 rounded-xl border border-neutral-200 px-3 text-sm font-medium text-neutral-700 transition data-checked:border-emerald-600 data-checked:bg-emerald-50 data-checked:text-emerald-800 data-disabled:cursor-not-allowed data-disabled:opacity-60 dark:border-neutral-700 dark:text-neutral-200 dark:data-checked:border-emerald-500 dark:data-checked:bg-emerald-950/50 dark:data-checked:text-emerald-300";
  
  return (
    <form className={" p-3 space-y-4 sm:w-3xs grow"}>
    {/* <form className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900"> */}
      <div className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-200">
        <Filter className="size-4 text-neutral-500" />
        <span>Sichtbarkeit</span>
      </div>

      <RadioGroup
        value={filters.visibility}
        onChange={handleVisibilityChange}
        aria-label="Sichtbarkeit"
        className="flex flex-col items-center justify-center sm:flex-row gap-4"
      >
        {recipeVisibilityOptions.map((option) => {
          const disabled = option.value === "private" && !canViewPrivateRecipes;

          return (
            <Radio
              as="div"
              key={option.value}
              value={option.value}
              disabled={disabled}
              className={"group flex flex-col cursor-pointer items-center justify-center gap-2 rounded-full border hover:border-emerald-600 hover:text-emerald-700 dark:border-neutral-700 dark:text-neutral-300 dark:hover:text-emerald-400 px-4 py-2 w-13 h-13"}
            >
              <span className="size-2.5 rounded-full bg-transparent ring-1 ring-neutral-400 hover:ring-emerald-600 transition group-data-checked:bg-emerald-600 group-data-checked:ring-emerald-600 dark:ring-neutral-500 dark:group-data-checked:bg-emerald-400 dark:group-data-checked:ring-emerald-400" />
              {option.value === "private" ? (
                <Lock className="size-3.5" />
              ) : option.value === "public" ? (
                <GlobeCheck className="size-3.5" />
              ) : <span className="text-xs uppercase">{option.value}</span>}
            </Radio>
          );
        })}
      </RadioGroup>
    </form>
  );
}
