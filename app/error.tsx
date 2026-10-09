"use client";

export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & {digest?: string};
  retry: () => void;
}) {
  return (
    <main className="flex flex-1 flex-col gap-4 items-start justify-start px-8 py-10 w-full">
      <h1 className="text-2xl font-bold text-black dark:text-zinc-50">
        There was an error:
      </h1>
      <p className="text-lg text-gray-500">{error.message}</p>
      <button
        onClick={retry}
        className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
      >
        Retry
      </button>
    </main>
  );
}
