import Database from "better-sqlite3";
import { fileURLToPath } from "node:url";

export function resolveDatabasePath(customPath) {
  if (customPath) {
    return customPath;
  }

  return fileURLToPath(new URL("./watchlist.db", import.meta.url));
}

export function createDatabase(customPath) {
  const db = new Database(resolveDatabasePath(customPath));

  db.exec(`
    CREATE TABLE IF NOT EXISTS watchlist_items (
      external_id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      year INTEGER,
      poster_url TEXT,
      genre TEXT,
      description TEXT,
      runtime_minutes INTEGER,
      streaming_service TEXT,
      priority TEXT NOT NULL DEFAULT 'medium',
      planned_date TEXT,
      status TEXT NOT NULL DEFAULT 'want',
      user_rating REAL DEFAULT NULL,
      notes TEXT DEFAULT '',
      added_at TEXT NOT NULL
    );
  `);

  const existingColumns = new Set(
    db.prepare("PRAGMA table_info(watchlist_items)").all().map((column) => column.name),
  );

  const columnDefinitions = {
    genre: "TEXT",
    description: "TEXT",
    runtime_minutes: "INTEGER",
    streaming_service: "TEXT",
    priority: "TEXT NOT NULL DEFAULT 'medium'",
    planned_date: "TEXT",
  };

  for (const [columnName, definition] of Object.entries(columnDefinitions)) {
    if (!existingColumns.has(columnName)) {
      db.exec(`ALTER TABLE watchlist_items ADD COLUMN ${columnName} ${definition}`);
    }
  }

  return db;
}

const db = createDatabase(process.env.DB_PATH);

export default db;
