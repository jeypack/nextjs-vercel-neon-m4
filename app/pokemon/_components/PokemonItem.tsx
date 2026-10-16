"use client";

import PokemonImage from "@/app/pokemon/_components/PokemonImage";
import PokemonDetail from "@/app/pokemon/_components/PokemonDetail";
import type {IPokemonDetail} from "@/app/pokemon/_lib/types";
import {useModal} from "@/app/_context/ModalContext";
import placeholder from "@/app/pokemon/_lib/placeholder.png";

export default function PokemonItem({
  id,
  name,
  weight,
  height,
  abilities,
  baseExperience,
  order,
  species,
  sprites,
}: IPokemonDetail) {
  const {open} = useModal();
  const handleClick = () => {
    console.log(name);
    open(
      "Pokemon Details",
      <PokemonDetail
        id={id}
        name={name}
        weight={weight}
        height={height}
        sprites={sprites}
        abilities={abilities}
        baseExperience={baseExperience}
        order={order}
        species={species}
      />,
    );
  };

  return (
    <div
      className="flex flex-row gap-2 justify-between items-baseline-last select-none"
      onClick={handleClick}
    >
      <p className="flex-1 text-right text-sm text-gray-500">
        Weight:
        <br />
        <span className="font-bold text-gray-400">{weight}</span>
      </p>
      <p className="flex-1 text-right text-sm text-gray-500">
        Height:
        <br />
        <span className="font-bold text-gray-400">{height}</span>
      </p>
      {sprites[0]?.url && (
        <PokemonImage
          url={sprites[0].url ?? placeholder.src}
          alt={name}
          className="w-16 h-auto"
        />
      )}
    </div>
  );
}
