export default function RecipesLoading() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:py-16">
      <section className="space-y-4">
        <div className="h-6 w-40 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-10 w-72 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-5 w-full max-w-2xl animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
      </section>

      <section className="mt-10 h-64 rounded-2xl space-y-4 border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="h-5 w-50 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-10 w-72 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
      </section>

      <div className="h-5 w-50 mt-10 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
      <section className="mt-4 h-12 rounded-2xl space-y-4 border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="h-5 w-50 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
      </section>
      <div className="h-3 w-50 mt-2 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />

      <section className="mt-10 h-30 rounded-2xl space-y-4 border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="h-5 w-50 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="grid gap-2 sm:grid-cols-3">
          <div className="flex min-h-12 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800" />
          <div className="flex min-h-12 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800" />
          <div className="flex min-h-12 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800" />
        </div>
      </section>

      <section className="mt-5">
        <div className="flex gap-2 overflow-x-auto pb-2">
          <div className="flex h-9 w-14 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800" />
          <div className="flex h-9 w-18 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800" />
          <div className="flex h-9 w-32 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800" />
          <div className="flex h-9 w-20 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800" />
          <div className="flex h-9 w-30 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800" />
          <div className="flex h-9 w-29 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800" />
          <div className="flex h-9 w-25 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800" />
        </div>
      </section>

      {/* <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
      </section> */}
    </main>
  );
}
