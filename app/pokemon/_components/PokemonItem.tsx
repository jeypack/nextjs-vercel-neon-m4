import PokemonImage from "@/app/pokemon/_components/PokemonImage";
import type {IPokemonItemProps} from "@/app/pokemon/_lib/types";

export default function PokemonItem({imageUrl, weight, height, name}: IPokemonItemProps) {
  return (
    <div className="flex flex-row justify-between items-baseline-last gap-2">
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
      <PokemonImage url={imageUrl} alt={name} className="w-16 h-auto" />
    </div>
  );
}
