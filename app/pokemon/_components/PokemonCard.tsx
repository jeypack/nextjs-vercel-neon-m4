"use client";
import {Suspense} from "react";
import {Loader2} from "lucide-react";
import type {IPokemon, IPokemonDetail} from "@/app/pokemon/_lib/types";
import {getPokemon} from "@/app/pokemon/_lib/actions";
import PokemonImage from "./PokemonImage";

export default function PokemonCard({id, name, url}: IPokemon) {
  const card: Promise<IPokemonDetail> = getPokemon(url);
  return (
    <div className="flex-initial flex flex-col justify-between p-3 border h-32 w-full sm:w-60 md:w-56 rounded">
      <div className="flex flex-row justify-between items-center">
        <h2 className="text-lg font-bold">{name}</h2>
        <p className="text-lg text-gray-500">{id}</p>
      </div>
      <Suspense
        fallback={
          <div className="flex flex-row justify-between items-baseline-last gap-2">
            <p className="flex-1 text-right text-sm text-gray-500">
              Weight:
              <br />
              <span className="font-bold text-gray-400">0</span>
            </p>
            <p className="flex-1 text-right text-sm text-gray-500">
              Height:
              <br />
              <span className="font-bold text-gray-400">0</span>
            </p>
            <div className="w-16 h-16">
              <Loader2 className="animate-spin mx-auto mt-4" size={24} />
            </div>
          </div>
        }
      >
        {card.then((data) => (
          <div className="flex flex-row justify-between items-baseline-last gap-2">
            <p className="flex-1 text-right text-sm text-gray-500">
              Weight:
              <br />
              <span className="font-bold text-gray-400">{data.weight}</span>
            </p>
            <p className="flex-1 text-right text-sm text-gray-500">
              Height:
              <br />
              <span className="font-bold text-gray-400">{data.height}</span>
            </p>
            <PokemonImage
              url={data.sprites[0]?.url ?? ""}
              alt={name}
              className="w-16 h-auto"
            />
          </div>
        ))}
      </Suspense>
    </div>
  );
}
