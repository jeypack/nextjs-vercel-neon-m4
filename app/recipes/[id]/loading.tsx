export default function RecipeLoading() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:py-16">
      <section className="flex items-center justify-between gap-4">
        <div className="h-5 w-48 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800 sm:w-60" />
        <div className="h-9 w-44 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
      </section>

      <section className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900 sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <div className="h-6 w-24 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-6 w-28 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-6 w-24 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-800" />
        </div>

        <div className="mt-4 h-9 w-3/4 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800 sm:w-2/3" />
        <div className="mt-3 h-5 w-full animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />

        <div className="mt-5 flex flex-wrap gap-4 border-t border-neutral-100 pt-4 dark:border-neutral-800">
          <div className="h-5 w-24 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-5 w-28 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-5 w-32 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900 sm:p-8">
        <div className="h-7 w-28 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
        <ul className="mt-4 space-y-2">
          {Array.from({length: 6}).map((_, index) => (
            <li
              key={index}
              className="h-10 animate-pulse rounded-lg border border-neutral-100 bg-neutral-200 dark:border-neutral-800 dark:bg-neutral-800"
            />
          ))}
        </ul>
      </section>

      <section className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900 sm:p-8">
        <div className="h-7 w-36 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="mt-4 space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-4 w-full animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
        </div>
      </section>
    </main>
  );
}
