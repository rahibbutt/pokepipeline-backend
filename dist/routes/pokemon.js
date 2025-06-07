"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.triggerPipelineHandler = exports.pokemonHandler = void 0;
const database_1 = __importDefault(require("../db/database"));
const fetch_1 = require("../fetch");
const queries_1 = require("../queries");
const pokemonHandler = (req, res) => {
    try {
        const pokemons = database_1.default.prepare(`SELECT * FROM pokemons`).all();
        const result = pokemons.map(pokemon => {
            // Get types
            const types = database_1.default.prepare(`
        SELECT t.name, pt.slot
        FROM pokemon_types pt
        JOIN types t ON pt.type_id = t.id
        WHERE pt.pokemon_id = ?
        ORDER BY pt.slot
      `).all(pokemon.id);
            // Get abilities
            const abilitiesRaw = database_1.default.prepare(`
        SELECT a.name, pa.is_hidden, pa.slot
        FROM pokemon_abilities pa
        JOIN abilities a ON pa.ability_id = a.id
        WHERE pa.pokemon_id = ?
        ORDER BY pa.slot
      `).all(pokemon.id);
            const abilities = abilitiesRaw.map(a => ({
                name: a.name,
                is_hidden: Boolean(a.is_hidden),
                slot: a.slot
            }));
            // Get stats
            const statsRaw = database_1.default.prepare(`
        SELECT s.name, ps.base_stat
        FROM pokemon_stats ps
        JOIN stats s ON ps.stat_id = s.id
        WHERE ps.pokemon_id = ?
      `).all(pokemon.id);
            // You can keep stats as array or convert to object
            const stats = statsRaw.map(s => ({
                name: s.name,
                base_stat: s.base_stat
            }));
            /*
            // Optional: convert stats to key-value object
            const stats = statsRaw.reduce((acc, stat) => {
              acc[stat.name] = stat.base_stat;
              return acc;
            }, {} as Record<string, number>);
            */
            return {
                id: pokemon.id,
                name: pokemon.name,
                sprite_url: pokemon.sprite_url,
                types,
                abilities,
                stats
            };
        });
        res.json(result);
    }
    catch (err) {
        console.error('Error fetching Pokemon:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.pokemonHandler = pokemonHandler;
const triggerPipelineHandler = async (req, res) => {
    try {
        const list = await (0, fetch_1.fetchPokemonList)();
        const pokemons = await (0, fetch_1.fetchPokemons)(list);
        (0, queries_1.insertPokemonData)(pokemons);
        res.json({ status: "OK" });
    }
    catch (err) {
        console.error('Error triggering pipeline:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.triggerPipelineHandler = triggerPipelineHandler;
