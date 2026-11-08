export default function RecipeCreateLoading() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:py-16">
      {/* Header Section */}
      <section className="mb-6">
        <div className="h-6 w-40 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="mt-2 h-10 w-80 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="mt-3 h-5 w-full max-w-2xl animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
      </section>

      {/* Form Panel */}
      <section className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900 sm:p-6 space-y-5">
        {/* Title Field */}
        <div className="sm:col-span-2">
          <div className="h-4 w-24 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800 mb-2" />
          <div className="h-12 w-full animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800" />
        </div>

        {/* Grid Fields: Category & Difficulty */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <div className="h-4 w-20 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800 mb-2" />
            <div className="h-10 w-full animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
          </div>
          <div>
            <div className="h-4 w-24 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800 mb-2" />
            <div className="h-10 w-full animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
          </div>

          {/* Prep Time & Servings */}
          <div>
            <div className="h-4 w-32 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800 mb-2" />
            <div className="h-10 w-full animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800" />
          </div>
          <div>
            <div className="h-4 w-20 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800 mb-2" />
            <div className="h-10 w-full animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800" />
          </div>
        </div>

        {/* Description Textarea */}
        <div>
          <div className="h-4 w-24 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800 mb-2" />
          <div className="h-20 w-full animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800" />
        </div>

        {/* Instructions Textarea */}
        <div>
          <div className="h-4 w-20 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800 mb-2" />
          <div className="h-40 w-full animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800" />
        </div>

        {/* Ingredients Section */}
        <div className="space-y-3 rounded-xl border border-neutral-200 p-4 dark:border-neutral-700">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="h-4 w-20 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
            <div className="h-10 w-32 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
          </div>

          {/* Ingredient Rows */}
          {Array.from({length: 2}).map((_, rowIndex) => (
            <div
              key={rowIndex}
              className="space-y-3 rounded-lg bg-neutral-50 p-3 dark:bg-neutral-800/50"
            >
              {/* Ingredient Row Grid */}
              <div className="grid gap-3 sm:grid-cols-[1.2fr_0.6fr_0.6fr_auto]">
                <div>
                  <div className="h-4 w-20 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800 mb-2" />
                  <div className="h-10 w-full animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
                </div>
                <div>
                  <div className="h-4 w-12 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800 mb-2" />
                  <div className="h-10 w-full animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800" />
                </div>
                <div>
                  <div className="h-4 w-16 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800 mb-2" />
                  <div className="h-10 w-full animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
                </div>
                <div className="flex items-end">
                  <div className="h-10 w-20 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
                </div>
              </div>

              {/* Notes Field */}
              <div>
                <div className="h-4 w-32 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800 mb-2" />
                <div className="h-10 w-full animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800" />
              </div>
            </div>
          ))}
        </div>

        {/* Checkbox */}
        <div className="h-6 w-48 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end pt-4">
          <div className="h-11 flex-1 sm:flex-initial sm:w-24 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-11 flex-1 sm:flex-initial sm:w-32 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
        </div>
      </section>
    </main>
  );
}
