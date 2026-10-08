import {Suspense} from "react";
import {Loader2} from "lucide-react";
import getPokemonPage from "@/app/pokemon/_lib/actions";
import PokemonPage from "@/app/pokemon/_components/PokemonPage";

export const metadata = {
  title: "Pokemon",
  description: "Explore the world of Pokemon",
};

export default async function Page() {
  const result = getPokemonPage();

  return (
    <main className="flex flex-1 flex-col items-start justify-start px-8 py-10 w-full">
      <h1 className="text-2xl mb-2 font-bold">Pokemon</h1>
      <Suspense
        fallback={<Loader2 className="animate-spin mt-4" size={24} />}
      >
        {result.then((data) => (
          <PokemonPage result={data} />
        ))}
      </Suspense>
    </main>
  );
}
