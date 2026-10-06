import {Loader2} from "lucide-react";

export default function Loading() {
  return (
    <>
      <main className="flex flex-1 flex-col items-center justify-center px-8 py-10 w-full text-center">
        <h1 className="text-3xl">Loading Random Dog</h1>
        <Loader2 className="animate-spin mx-auto mt-4" size={24} />
        <p className="text-gray-500 text-lg">Loading...</p>
      </main>
    </>
  );
}
