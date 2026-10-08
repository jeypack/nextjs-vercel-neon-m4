import type {
  IPokemonResults,
  IPokemon,
  IPokemonDetail,
} from "@/app/pokemon/_lib/types";

async function getPokemonPage(
  url: string = "https://pokeapi.co/api/v2/pokemon",
) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Fehler beim Laden der Pokemon-Daten");
  const data = await res.json();
  //console.log(data);
  const result: IPokemonResults = {
    count: data.count,
    next: data.next,
    previous: data.previous,
    data: data.results.map(({name, url}: {name: string; url: string}) => {
      const id = parseInt(url.split("/").filter(Boolean).pop() ?? "0", 10);
      return {id, name, url};
    }),
  };
  console.log(result);
  return result;
}

export async function getPokemon(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Fehler beim Finden des Pokemon");
  const data = await res.json();
  //console.log(data);
  const pokemon: IPokemonDetail = {
    id: data.id,
    abilities: data.abilities,
    name: data.name,
    baseExperience: data.base_experience,
    order: data.order,
    weight: data.weight,
    height: data.height,
    species: data.species,
    sprites: data.sprites.other.home.front_default
      ? [
          {url: data.sprites.other.home.front_default},
          {url: data.sprites.other.showdown.front_shiny},
          {url: data.sprites.other.showdown.back_default},
        ]
      : [],
  };
  console.log(pokemon);
  return pokemon;
}

export default getPokemonPage;
