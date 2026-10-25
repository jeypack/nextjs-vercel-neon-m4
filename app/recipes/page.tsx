import GeminiTest from "@/app/cook/_components/AIRecipe";

export default async function Page() {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-6 dark:border-neutral-800 dark:bg-neutral-900">
      <h1 className="text-2xl font-bold">Gemini Test</h1>

      <GeminiTest />
    </div>
  );
}
