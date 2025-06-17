import Database from "better-sqlite3";
import path from "path";

const dbPath = path.resolve(__dirname, "../../pokemon.db"); // ⬅ correct!
// console.log('path', dbPath)
const db = new Database(dbPath);

export default db;
