import GeminiTest from "@/app/cook/_components/AIRecipe";

export default async function Page() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
      <div className="rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 p-4 sm:p-6">
        <h1 className="text-2xl font-bold">Gemini Test</h1>

        <GeminiTest />
      </div>
    </main>
  );
}
