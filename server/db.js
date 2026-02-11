import Database from "better-sqlite3";

const db = new Database("watchlist.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS watchlist_items (
    external_id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    year INTEGER,
    poster_url TEXT,
    status TEXT NOT NULL DEFAULT 'want',
    user_rating REAL DEFAULT NULL,
    notes TEXT DEFAULT '',
    added_at TEXT NOT NULL
  );
`);

export default db;