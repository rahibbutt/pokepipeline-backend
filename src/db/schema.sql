CREATE TABLE pokemons (
                          id INTEGER PRIMARY KEY,
                          name TEXT NOT NULL,
                          sprite_url TEXT
);

CREATE TABLE types (
                       id INTEGER PRIMARY KEY AUTOINCREMENT,
                       name TEXT UNIQUE NOT NULL
);

CREATE TABLE abilities (
                           id INTEGER PRIMARY KEY AUTOINCREMENT,
                           name TEXT UNIQUE NOT NULL
);

CREATE TABLE stats (
                       id INTEGER PRIMARY KEY AUTOINCREMENT,
                       name TEXT UNIQUE NOT NULL
);

CREATE TABLE pokemon_types (
                               pokemon_id INTEGER,
                               type_id INTEGER,
                               slot INTEGER,
                               PRIMARY KEY (pokemon_id, type_id),
                               FOREIGN KEY (pokemon_id) REFERENCES pokemons(id) ON DELETE CASCADE,
                               FOREIGN KEY (type_id) REFERENCES types(id)
);

CREATE TABLE pokemon_abilities (
                                   pokemon_id INTEGER,
                                   ability_id INTEGER,
                                   is_hidden BOOLEAN,
                                   slot INTEGER,
                                   PRIMARY KEY (pokemon_id, ability_id),
                                   FOREIGN KEY (pokemon_id) REFERENCES pokemons(id) ON DELETE CASCADE,
                                   FOREIGN KEY (ability_id) REFERENCES abilities(id)
);

CREATE TABLE pokemon_stats (
                               pokemon_id INTEGER,
                               stat_id INTEGER,
                               base_stat INTEGER,
                               PRIMARY KEY (pokemon_id, stat_id),
                               FOREIGN KEY (pokemon_id) REFERENCES pokemons(id) ON DELETE CASCADE,
                               FOREIGN KEY (stat_id) REFERENCES stats(id)
);
