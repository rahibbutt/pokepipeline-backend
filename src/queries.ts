import db from "./db/database";
import { Ability, Pokemon, Stat, Type3, Type4 } from "./types";

export const insertOrReplacePokemons = (
  id: number,
  name: string,
  sprite_url: string,
) => {
  db.prepare(
    `
        INSERT OR REPLACE INTO pokemons (id, name, sprite_url)
        VALUES (?, ?, ?)
      `,
  ).run(id, name, sprite_url);
};

export const insertPokemonType = (id: number, slot: number, type: Type4) => {
  const typeName = type.name;

  const typeRow = db
    .prepare("SELECT id FROM types WHERE name = ?")
    .get(typeName) as { id: number } | undefined;
  let typeId = typeRow?.id;

  if (!typeId) {
    const insert = db
      .prepare("INSERT INTO types(name) VALUES (?)")
      .run(typeName);
    typeId = Number(insert.lastInsertRowid);
  }

  db.prepare(
    `
          INSERT OR REPLACE INTO pokemon_types (pokemon_id, type_id, slot)
          VALUES (?, ?, ?)
        `,
  ).run(id, typeId, slot);
};

export const insertPokemonTypes = (id: number, types: Type3[]) => {
  for (const { type, slot } of types) {
    insertPokemonType(id, slot, type);
  }
};

export const insertPokemonAbilities = (id: number, abilities: Ability[]) => {
  // Insert abilities
  for (const abilityItem of abilities) {
    const { ability, is_hidden, slot } = abilityItem;
    const abilityName = ability.name;

    const abilityRow = db
      .prepare("SELECT id FROM abilities WHERE name = ?")
      .get(abilityName) as { id: number } | undefined;
    let abilityId = abilityRow?.id;

    if (!abilityId) {
      const insert = db
        .prepare("INSERT INTO abilities(name) VALUES (?)")
        .run(abilityName);
      abilityId = Number(insert?.lastInsertRowid);
    }

    db.prepare(
      `
          INSERT OR REPLACE INTO pokemon_abilities (pokemon_id, ability_id, is_hidden, slot)
          VALUES (?, ?, ?, ?)
        `,
    ).run(id, abilityId, is_hidden ? 1 : 0, slot);
  }
};

export const insertPokemonStats = (id: number, stats: Stat[]) => {
  // Insert stats
  for (const { base_stat, stat } of stats) {
    const statName = stat.name;

    const statRow = db
      .prepare("SELECT id FROM stats WHERE name = ?")
      .get(statName) as { id: number } | undefined;
    let statId = statRow?.id;

    if (!statId) {
      const insert = db
        .prepare("INSERT INTO stats(name) VALUES (?)")
        .run(statName);
      statId = Number(insert.lastInsertRowid);
    }

    db.prepare(
      `
          INSERT OR REPLACE INTO pokemon_stats (pokemon_id, stat_id, base_stat)
          VALUES (?, ?, ?)
        `,
    ).run(id, statId, base_stat);
  }
};

export const insertPokemonData = (pokemons: Pokemon[]) => {
  for (const pokemon of pokemons) {
    const { name, id, sprites, types, abilities, stats } = pokemon;
    try {
      const sprite_url = sprites.front_default;

      // Insert into pokemon
      insertOrReplacePokemons(id, name, sprite_url);

      // Insert types
      insertPokemonTypes(id, types);

      // Insert abilities comes here
      insertPokemonAbilities(id, abilities);

      // Insert stats
      insertPokemonStats(id, stats);

      console.log(`Inserted Pokemon: ${name}`);
    } catch (err) {
      console.error(`Error inserting ${name}:`, err);
    }
  }
};
