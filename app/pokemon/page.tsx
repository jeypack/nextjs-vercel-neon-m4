import {Suspense} from "react";
import {Loader2} from "lucide-react";
import getPokemonPage from "@/app/pokemon/_lib/actions";
import {pageSize} from "@/app/pokemon/_lib/utils";
import PokemonPage from "@/app/pokemon/_components/PokemonPage";
import type {IPokemonResults} from "@/app/pokemon/_lib/types";

export const metadata = {
  title: "Pokemon",
  description: "Explore the world of Pokemon",
};

// Note: pageSize is imported from actions.ts

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{page?: string}>;
}) {
  return (
    <main className="flex flex-1 flex-col items-start justify-start px-8 py-10 w-full">
      <h1 className="text-2xl mb-2 font-bold">Pokemon</h1>
      <Suspense fallback={<Loader2 className="animate-spin mt-4" size={24} />}>
        {searchParams.then((params) => {
          const page: number = Math.max(1, Number(params.page) || 1);
          const offset: number = (page - 1) * pageSize;
          const currentPage: Promise<IPokemonResults> = getPokemonPage(
            offset,
            pageSize,
          );
          return (
            <Suspense
              fallback={<Loader2 className="animate-spin mt-4" size={24} />}
            >
              {currentPage.then(({count, data}) => {
                return (
                  <PokemonPage
                    count={count}
                    data={data}
                    page={page}
                    pageSize={pageSize}
                  />
                );
              })}
            </Suspense>
          );
        })}
      </Suspense>
    </main>
  );
}
