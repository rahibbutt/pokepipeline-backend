"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertPokemonData = exports.insertPokemonStats = exports.insertPokemonAbilities = exports.insertPokemonTypes = exports.insertPokemonType = exports.insertOrReplacePokemons = void 0;
const database_1 = __importDefault(require("./db/database"));
const insertOrReplacePokemons = (id, name, sprite_url) => {
    database_1.default.prepare(`
        INSERT OR REPLACE INTO pokemons (id, name, sprite_url)
        VALUES (?, ?, ?)
      `).run(id, name, sprite_url);
};
exports.insertOrReplacePokemons = insertOrReplacePokemons;
const insertPokemonType = (id, slot, type) => {
    const typeName = type.name;
    const typeRow = database_1.default.prepare('SELECT id FROM types WHERE name = ?').get(typeName);
    let typeId = typeRow?.id;
    if (!typeId) {
        const insert = database_1.default.prepare('INSERT INTO types(name) VALUES (?)').run(typeName);
        typeId = Number(insert.lastInsertRowid);
    }
    database_1.default.prepare(`
          INSERT OR REPLACE INTO pokemon_types (pokemon_id, type_id, slot)
          VALUES (?, ?, ?)
        `).run(id, typeId, slot);
};
exports.insertPokemonType = insertPokemonType;
const insertPokemonTypes = (id, types) => {
    for (const { type, slot } of types) {
        (0, exports.insertPokemonType)(id, slot, type);
    }
};
exports.insertPokemonTypes = insertPokemonTypes;
const insertPokemonAbilities = (id, abilities) => {
    // Insert abilities
    for (const abilityItem of abilities) {
        const { ability, is_hidden, slot } = abilityItem;
        const abilityName = ability.name;
        const abilityRow = database_1.default.prepare('SELECT id FROM abilities WHERE name = ?').get(abilityName);
        let abilityId = abilityRow?.id;
        if (!abilityId) {
            const insert = database_1.default.prepare('INSERT INTO abilities(name) VALUES (?)').run(abilityName);
            abilityId = Number(insert.lastInsertRowid);
        }
        database_1.default.prepare(`
          INSERT OR REPLACE INTO pokemon_abilities (pokemon_id, ability_id, is_hidden, slot)
          VALUES (?, ?, ?, ?)
        `).run(id, abilityId, is_hidden ? 1 : 0, slot);
    }
};
exports.insertPokemonAbilities = insertPokemonAbilities;
const insertPokemonStats = (id, stats) => {
    // Insert stats
    for (const { base_stat, stat } of stats) {
        const statName = stat.name;
        const statRow = database_1.default.prepare('SELECT id FROM stats WHERE name = ?').get(statName);
        let statId = statRow?.id;
        if (!statId) {
            const insert = database_1.default.prepare('INSERT INTO stats(name) VALUES (?)').run(statName);
            statId = Number(insert.lastInsertRowid);
        }
        database_1.default.prepare(`
          INSERT OR REPLACE INTO pokemon_stats (pokemon_id, stat_id, base_stat)
          VALUES (?, ?, ?)
        `).run(id, statId, base_stat);
    }
};
exports.insertPokemonStats = insertPokemonStats;
const insertPokemonData = (pokemons) => {
    for (const pokemon of pokemons) {
        const { name, id, sprites, types, abilities, stats } = pokemon;
        try {
            const sprite_url = sprites.front_default;
            // Insert into pokemon
            (0, exports.insertOrReplacePokemons)(id, name, sprite_url);
            // Insert types
            (0, exports.insertPokemonTypes)(id, types);
            // Insert abilities comes here
            (0, exports.insertPokemonAbilities)(id, abilities);
            // Insert stats
            (0, exports.insertPokemonStats)(id, stats);
            console.log(`Inserted Pokemon: ${name}`);
        }
        catch (err) {
            console.error(`Error inserting ${name}:`, err);
        }
    }
};
exports.insertPokemonData = insertPokemonData;
