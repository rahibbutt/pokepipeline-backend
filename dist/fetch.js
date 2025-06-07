"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchPokemons = exports.fetchPokemonList = exports.fetchPokemon = void 0;
const axios_1 = __importDefault(require("axios"));
const utils_1 = require("./utils");
const fetchPokemon = async (url) => {
    const response = await axios_1.default.get(url);
    return response.data;
};
exports.fetchPokemon = fetchPokemon;
const fetchPokemonList = async () => {
    const response = await axios_1.default.get('https://pokeapi.co/api/v2/pokemon?limit=20');
    return response.data.results;
};
exports.fetchPokemonList = fetchPokemonList;
const fetchPokemons = async (list) => {
    const pokemons = [];
    try {
        const pokemonPromises = list.map(async (pokemonResult) => {
            const { url } = pokemonResult;
            const pokemonPromise = (0, exports.fetchPokemon)(url);
            return pokemonPromise;
        });
        const pokemonsResult = await Promise.allSettled(pokemonPromises);
        const pokemonList = (0, utils_1.getPromiseSettledResultData)(pokemonsResult);
        return pokemonList;
    }
    catch (error) {
        console.log('Error fetching pokemons', error);
    }
    return pokemons;
};
exports.fetchPokemons = fetchPokemons;
