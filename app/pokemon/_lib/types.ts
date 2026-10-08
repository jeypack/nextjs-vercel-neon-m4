interface IPokemonImage {
  url: string;
  alt: string;
}

interface IPokemon {
  id: number;
  name: string;
  url: string;
}

interface IPokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  abilities: {ability: {name: string; url: string}}[];
  baseExperience: number;
  order: number;
  species: {name: string; url: string};
  sprites: {url: string}[];
}

interface IPokemonResults {
  count: number;
  next: string | null;
  previous: string | null;
  data: IPokemon[];
}

export type {IPokemon, IPokemonResults, IPokemonDetail, IPokemonImage};
