"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fetch_1 = require("./fetch");
const queries_1 = require("./queries");
const main = async () => {
    const list = await (0, fetch_1.fetchPokemonList)();
    const pokemons = await (0, fetch_1.fetchPokemons)(list);
    (0, queries_1.insertPokemonData)(pokemons);
};
main();
