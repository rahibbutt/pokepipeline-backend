import {Request, Response} from 'express';
import db from '../db/database';
import {fetchPokemonList, fetchPokemons} from "../fetch";
import {insertPokemonData} from "../queries";

export const pokemonHandler = (req:Request, res:Response) => {
  try {
    const pokemons = db.prepare(`SELECT * FROM pokemons`).all() as {
      id: number;
      name: string;
      sprite_url: string;
    }[];

    const result = pokemons.map(pokemon => {
      // Get types
      const types = db.prepare(`
        SELECT t.name, pt.slot
        FROM pokemon_types pt
        JOIN types t ON pt.type_id = t.id
        WHERE pt.pokemon_id = ?
        ORDER BY pt.slot
      `).all(pokemon.id) as { name: string; slot: number }[];

      // Get abilities
      const abilitiesRaw = db.prepare(`
        SELECT a.name, pa.is_hidden, pa.slot
        FROM pokemon_abilities pa
        JOIN abilities a ON pa.ability_id = a.id
        WHERE pa.pokemon_id = ?
        ORDER BY pa.slot
      `).all(pokemon.id) as { name: string; is_hidden: number; slot: number }[];

      const abilities = abilitiesRaw.map(a => ({
        name: a.name,
        is_hidden: Boolean(a.is_hidden),
        slot: a.slot
      }));

      // Get stats
      const statsRaw = db.prepare(`
        SELECT s.name, ps.base_stat
        FROM pokemon_stats ps
        JOIN stats s ON ps.stat_id = s.id
        WHERE ps.pokemon_id = ?
      `).all(pokemon.id) as { name: string; base_stat: number }[];

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
  } catch (err) {
    console.error('Error fetching Pokemon:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export const triggerPipelineHandler = async (req:Request, res:Response) => {
  try {
    const list = await fetchPokemonList()
    const pokemons = await fetchPokemons(list)
    insertPokemonData(pokemons)
    res.json({ status: "OK"});
  } catch (err) {
    console.error('Error triggering pipeline:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}