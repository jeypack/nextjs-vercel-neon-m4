export default function RecipesLoading() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:py-16">
      <section className="space-y-4">
        <div className="h-6 w-40 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-10 w-72 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-5 w-full max-w-2xl animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
      </section>

      <section className="mt-10 rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto]">
          <div className="h-12 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-12 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-12 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800" />
        </div>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({length: 6}).map((_, index) => (
          <article
            key={index}
            className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div className="h-5 w-24 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
            <div className="h-6 w-3/4 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
            <div className="h-12 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
            <div className="h-5 w-28 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
          </article>
        ))}
      </section>
    </main>
  );
}
