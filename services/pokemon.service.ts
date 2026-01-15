import type { PokemonMetadata } from "@/types";

export const getRandomPokemon = (): PokemonMetadata => {
  const pokemonId = Math.floor(Math.random() * 151) + 1;
  return {
    id: pokemonId,
    sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`,
  };
};

export const getPokemonSprite = (id: number): string => {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
};
