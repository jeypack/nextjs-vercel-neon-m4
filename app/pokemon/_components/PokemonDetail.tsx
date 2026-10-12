import PokemonImage from "@/app/pokemon/_components/PokemonImage";
import type {IPokemonDetail} from "@/app/pokemon/_lib/types";
import placeholder from "@/app/pokemon/_lib/placeholder.png";

export default function PokemonDetail({
  name,
  weight,
  height,
  sprites,
  abilities,
  baseExperience,
  order,
  species,
}: IPokemonDetail) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-bold">{name}</h2>

      <div className="flex flex-row gap-2 justify-between items-center">
        <p className="flex-1 text-sm text-gray-500">
          Weight: <span className="font-bold text-gray-400">{weight}</span>
        </p>
        <p className="flex-1 text-sm text-gray-500">
          Height: <span className="font-bold text-gray-400">{height}</span>
        </p>
        {sprites[0]?.url && (
          <PokemonImage
            url={sprites[0].url ?? placeholder.src}
            alt={name}
            className="w-32 h-auto"
          />
        )}
      </div>
      <p className="flex-1 text-sm text-gray-500">
        Base Experience:{" "}
        <span className="font-bold text-gray-400">{baseExperience}</span>
      </p>
      <p className="flex-1 text-sm text-gray-500">
        Abilities:{" "}
        <span className="font-bold text-gray-400">
          {abilities
            .map((item) => {
              console.log(item);
              return item.ability.name;
            })
            .join(", ")}
        </span>
      </p>
      <div className="flex flex-row gap-2 justify-between items-center">
        <div>
          <p className="flex-1 text-sm text-gray-500">
            Order: <span className="font-bold text-gray-400">{order}</span>
          </p>
          <p className="flex-1 text-sm text-gray-500">
            Species:{" "}
            <span className="font-bold text-gray-400">{species.name}</span>
          </p>
        </div>
        <div className="flex flex-row gap-12">
          {sprites[1]?.url && (
            <PokemonImage
              url={sprites[2].url ?? placeholder.src}
              alt={name}
              className="w-12 h-auto"
            />
          )}
          {sprites[2]?.url && (
            <PokemonImage
              url={sprites[1].url ?? placeholder.src}
              alt={name}
              className="w-12 h-auto"
            />
          )}
        </div>
      </div>
    </div>
  );
}
