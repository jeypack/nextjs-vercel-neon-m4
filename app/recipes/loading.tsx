export default function RecipesLoading() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:py-16">
      {/* Header Section */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="h-6 w-40 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
          {/* <div className="mt-2 h-10 w-72 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800 hidden sm:block" />
          <div className="mt-3 h-5 w-full max-w-2xl animate-pulse rounded bg-neutral-200 dark:bg-neutral-800 hidden sm:block" /> */}
        </div>
        <div className="h-11 w-full sm:w-48 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800" />
      </div>

      {/* Search Combobox Section */}
      <section className="mt-8">
        <div className="relative w-full">
          <div className="min-h-12 w-full rounded-xl border border-neutral-200 p-3 dark:border-neutral-700 animate-pulse bg-neutral-200 dark:bg-neutral-800" />
        </div>
        <div className="mt-2 h-4 w-80 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
      </section>

      {/* Filters Section */}
      <section className="flex gap-4 mt-10">
        {/* RecipeFiltersForm */}
        <div className="p-3 space-y-4 sm:w-3xs">
          <div className="flex items-center gap-2 h-4 w-24 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-800" />
          <div className="flex flex-col items-center justify-center sm:flex-row gap-4">
            <div className="flex flex-col cursor-pointer items-center justify-center gap-2 rounded-full w-13 h-13 border border-neutral-200 dark:border-neutral-700 animate-pulse bg-neutral-200 dark:bg-neutral-800" />
            <div className="flex flex-col cursor-pointer items-center justify-center gap-2 rounded-full w-13 h-13 border border-neutral-200 dark:border-neutral-700 animate-pulse bg-neutral-200 dark:bg-neutral-800" />
            <div className="flex flex-col cursor-pointer items-center justify-center gap-2 rounded-full w-13 h-13 border border-neutral-200 dark:border-neutral-700 animate-pulse bg-neutral-200 dark:bg-neutral-800" />
          </div>
        </div>

        {/* CategoryFilter */}
        <div className="mt-5 flex flex-wrap gap-2 pb-2">
          {Array.from({length: 5}).map((_, index) => (
            <div
              key={index}
              className="rounded-full px-4 py-2 text-sm h-9 font-medium transition flex items-center justify-center animate-pulse bg-neutral-200 dark:bg-neutral-800"
              style={{width: `${60 + index * 15}px`}}
            />
          ))}
        </div>
      </section>

      {/* Recipe Grid Section */}
      <section className="mt-8">
        <div className="mb-5 flex items-baseline justify-between gap-4">
          <div>
            <div className="h-6 w-32 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
            <div className="mt-1 h-4 w-48 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
          </div>
          <div className="h-4 w-20 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({length: 6}).map((_, index) => (
            <article
              key={index}
              className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div className="h-40 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
              <div className="h-5 w-20 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
              <div className="h-6 w-3/4 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
              <div className="space-y-2">
                <div className="h-4 w-full animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Meal Plan Banner Section */}
      <section className="mt-10 h-24 animate-pulse rounded-2xl bg-neutral-200 dark:bg-neutral-800" />
    </main>
  );
}
