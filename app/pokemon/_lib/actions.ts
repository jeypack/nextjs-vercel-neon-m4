"use server"

import type {IPokemonResults, IPokemonDetail} from "@/app/pokemon/_lib/types";

async function getPokemonPage(offset: number, limit: number = 20) {
  // Construct the URL for fetching the Pokémon page with the given offset and limit.
  const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Fehler beim Laden der Pokemon-Daten");
  const data = await res.json();
  //console.log(data);
  const result: IPokemonResults = {
    count: data.count,
    data: data.results.map(({name, url}: {name: string; url: string}) => {
      const id = parseInt(url.split("/").filter(Boolean).pop() ?? "0", 10);
      return {id, name, url};
    }),
  };
  console.log(result);
  return result;
}

//https://pokeapi.co/api/v2/pokemon?offset=0&limit=20
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
  //console.log(pokemon);
  return pokemon;
}

export default getPokemonPage;
