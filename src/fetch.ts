import axios from "axios";
import { Pokemon, PokemonResult } from "./types";
import { getPromiseSettledResultData } from "./utils";

export const fetchPokemon = async (url: string): Promise<Pokemon> => {
  const response = await axios.get(url);

  return response.data;
};

export const fetchPokemonList = async (): Promise<PokemonResult[]> => {
  const response = await axios.get(
    "https://pokeapi.co/api/v2/pokemon?limit=20",
  );

  return response.data.results;
};

export const fetchPokemons = async (list: PokemonResult[]) => {
  const pokemons: Pokemon[] = [];
  try {
    const pokemonPromises = list.map(async (pokemonResult) => {
      const { url } = pokemonResult;
      const pokemonPromise = fetchPokemon(url);
      return pokemonPromise;
    });

    const pokemonsResult = await Promise.allSettled(pokemonPromises);
    const pokemonList = getPromiseSettledResultData<Pokemon>(pokemonsResult);

    return pokemonList;
  } catch (error) {
    console.log("Error fetching pokemons", error);
  }
  return pokemons;
};
