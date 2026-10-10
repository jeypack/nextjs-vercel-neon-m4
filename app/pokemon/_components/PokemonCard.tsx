import {Suspense} from "react";
import CardSkeleton from "@/app/pokemon/_components/CardSkeleton";
import type {IPokemon, IPokemonDetail} from "@/app/pokemon/_lib/types";
import {getPokemon} from "@/app/pokemon/_lib/actions";
import PokemonItem from "@/app/pokemon/_components/PokemonItem";
import placeholder from "@/app/pokemon/_lib/placeholder.png";
import ErrorBoundary from "@/app/pokemon/pokemon-error-boundary";

export default function PokemonCard({id, name, url}: IPokemon) {
  const card: Promise<IPokemonDetail> = getPokemon(url);

  return (
    <div className="flex-initial flex flex-col justify-between p-3 border border-gray-400 h-32 w-full sm:w-60 md:w-56 rounded">
      <div className="flex flex-row justify-between items-center">
        <h2 className="text-lg font-bold uppercase">{name}</h2>
        <p className="text-lg text-gray-500">{id}</p>
      </div>
      <ErrorBoundary title="Failed to load Pokémon details">
        <Suspense fallback={<CardSkeleton />}>
          {card.then((data) => {
            //if (getRandomError()) throw new Error("Random error occurred");
            return (
              <PokemonItem
                imageUrl={data.sprites[0]?.url ?? placeholder.src}
                {...data}
              />
            );
          })}
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

function getRandomError(): boolean {
  return Math.round(Math.random() * 100) < 4;
}
