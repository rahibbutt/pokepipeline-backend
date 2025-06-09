# Pokepipeline-backend

Pokepipeline-backend is a production-ready ETL (Extract, Transform, Load) pipeline built
using Node.js, TypeScript and Express. It fetches, processes and stores Pokémon
data from the [PokeAPI](https://pokeapi.co/) into a 
structured SQL database (SQLite 3) and displays on the [pokepipeline-frontend](https://github.com/rahibbutt/pokepipeline-frontend) single-page application. Designed for modularity, semantic versioning and CI/CD integration,
the project is also available as a [Docker-ready](https://hub.docker.com/r/rahibbutt/backend) 
image for fast and consistent deployment.

## Run production-ready build locally using docker image
1. Run Docker image locally:
```
docker run -p 3000:80 rahibbutt/backend
```
Access the local server at: [http://localhost:3000](http://localhost:3000)
- **API endpoint 1** – Get all Pokémon data: [http://localhost:3000/api/pokemon](http://localhost:3000/api/pokemon)
- **API endpoint 2** – Trigger ETL pipeline: [http://localhost:3000/api/trigger-pipeline](http://localhost:3000/api/trigger-pipeline)



## Run project locally by cloning Github repository
1. Git clone using the web URL:
```
https://github.com/rahibbutt/pokepipeline-backend.git
```
2. Install npm dependencies:
```
npm install
```
3. Build the project:
```
npm run build
```
4. Run project locally:
```
npx ts-node src/index.ts
```
Access the local server at: [http://localhost:3000](http://localhost:3000)
- **API endpoint 1** – Get all Pokémon data: [http://localhost:3000/api/pokemon](http://localhost:3000/api/pokemon)
- **API endpoint 2** – Trigger ETL pipeline: [http://localhost:3000/api/trigger-pipeline](http://localhost:3000/api/trigger-pipeline)

## 📦 Technologies used

* Node.js + TypeScript
* Express
* SQLite 3
* Docker
* Semantic versioning
* GitHub Actions (CI/CD)
* ESLint, Prettier, Jest (for code quality and testing)
* PM2 process manager (automatic application monitoring)

## Database schema overview

The project uses a normalized SQL schema designed around 
core Pokémon data. To support structured queries, avoid
redundancy and maintain data integrity, the data is 
transformed and normalized into relational tables. 
This includes flattening nested attributes such as types,
abilities, and stats and mapping them into lookup and
join tables. Below is an overview of the key 
tables:

Pokémon tables stores the basic information:

```sql
CREATE TABLE pokemons (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    sprite_url TEXT
);
```
Lookup tables for reusable Pokémon attributes:
```sql
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
```
Many-to-many relationship between Pokémon and their types:
```sql
CREATE TABLE pokemon_types (
                               pokemon_id INTEGER,
                               type_id INTEGER,
                               slot INTEGER,
                               PRIMARY KEY (pokemon_id, type_id),
                               FOREIGN KEY (pokemon_id) REFERENCES pokemons(id) ON DELETE CASCADE,
                               FOREIGN KEY (type_id) REFERENCES types(id)
);
```
Maps Pokémon to their abilities, including hidden status 
and slot.
```sql
CREATE TABLE pokemon_abilities (
                                   pokemon_id INTEGER,
                                   ability_id INTEGER,
                                   is_hidden BOOLEAN,
                                   slot INTEGER,
                                   PRIMARY KEY (pokemon_id, ability_id),
                                   FOREIGN KEY (pokemon_id) REFERENCES pokemons(id) ON DELETE CASCADE,
                                   FOREIGN KEY (ability_id) REFERENCES abilities(id)
);
```
Connects Pokémon to their base stats (e.g., HP, Attack):
```sql
CREATE TABLE pokemon_stats (
                               pokemon_id INTEGER,
                               stat_id INTEGER,
                               base_stat INTEGER,
                               PRIMARY KEY (pokemon_id, stat_id),
                               FOREIGN KEY (pokemon_id) REFERENCES pokemons(id) ON DELETE CASCADE,
                               FOREIGN KEY (stat_id) REFERENCES stats(id)
);
```

## Assumptions

During the design and development of this project, the following assumptions were made:

- The project is scoped to handle a small dataset (20 Pokémons) for demonstration and testing purposes.
- The `id` field from the PokeAPI is directly used as the primary key in the `pokemons` table to ensure consistency.
- SQLite is used for simplicity and local development.
- The API is public-facing and does not implement any authentication.
- The pipeline assumes static Pokémon data during the ETL process.

## Potential improvements

- Extend the pipeline to support fetching all Pokémon (1000+), with batch fetching and pagination handling.
- Add query parameters to filter Pokémon by type, ability, or stat thresholds.
- Perform unit testings for all the functions.
- Expose some of the transformed Pokémon data via a GraphQL API.
- Handle complex transformations and relationships.

