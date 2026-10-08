import {Loader2} from "lucide-react";

export default function Loading() {
  return (
    <main className="flex flex-1 flex-col items-start justify-start px-8 py-10 w-full">
      <h1 className="text-2xl mb-2 font-bold">Blog</h1>
      <div className="mt-6 flex justify-center items-center gap-6 min-h-72 w-full">
        <Loader2 className="animate-spin mx-auto mt-4" size={24} />
      </div>
    </main>
  );
}
