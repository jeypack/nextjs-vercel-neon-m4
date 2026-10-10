import PokemonCard from "@/app/pokemon/_components/PokemonCard";
import {Suspense} from "react";
import {Loader2} from "lucide-react";
import type {IPokemonPageProps} from "@/app/pokemon/_lib/types";

export default async function PokemonPage({
  count,
  data,
  page,
  pageSize,
}: IPokemonPageProps) {
  /* return (
    <div>Loading...</div>
  ); */
  const totalPages: number = Math.ceil(count / pageSize);
  console.log("totalPages", totalPages);
  console.log("pageSize", pageSize);
  console.log("data", data);
  return (
    <>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mx-auto w-full">
        <Suspense
          fallback={<Loader2 className="animate-spin mt-4" size={24} />}
        >
          {data.map(({id, name, url}) => (
            <PokemonCard key={id} id={id} name={name} url={url} />
          ))}
        </Suspense>
      </div>

      <div className="mt-8 flex gap-4 justify-around items-center mx-auto">
        <form action="/pokemon" method="GET">
          <input type="hidden" name="page" value={Math.max(1, page - 1)} />
          <button
            type="submit"
            disabled={page === 1}
            className={
              "px-4 py-2 bg-blue-500 text-white rounded" +
              (page === 1
                ? " opacity-50 cursor-not-allowed"
                : " cursor-pointer")
            }
          >
            Previous
          </button>
        </form>

        <p>
          Page {page} of {totalPages}
        </p>

        <form action="/pokemon" method="GET">
          <input
            type="hidden"
            name="page"
            value={Math.min(totalPages, page + 1)}
          />
          <button
            type="submit"
            disabled={page >= totalPages}
            className={
              "px-4 py-2 bg-blue-500 text-white rounded" +
              (page >= totalPages
                ? " opacity-50 cursor-not-allowed"
                : " cursor-pointer")
            }
          >
            Next
          </button>
        </form>
      </div>
    </>
  );
}
