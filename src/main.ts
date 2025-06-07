import { fetchPokemonList, fetchPokemons } from "./fetch";
import { insertPokemonData } from "./queries";

const main = async () => {
  const list = await fetchPokemonList()
  const pokemons = await fetchPokemons(list)
  insertPokemonData(pokemons)
}

main()