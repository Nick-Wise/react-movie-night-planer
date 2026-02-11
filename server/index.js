import express from "express";
import cors from "cors";
import db from "./db.js";

const app = express();
const PORT = 5174;

app.use(cors());
app.use(express.json());



//Get all movies in the watchlist
app.get("/api/watchlist", (req, res) => {
  const rows = db
    .prepare("SELECT * FROM watchlist_items ORDER BY added_at DESC")
    .all();
  res.json(rows);
});

//Add new movie to watchlist
app.post("/api/watchlist", (req, res) => {
  const { externalId, title, year, posterUrl } = req.body;

  if (!externalId || !title) {
    return res.status(400).json({ error: "externalId and title are required" });
  }

  const now = new Date().toISOString();

  try {
    db.prepare(`
      INSERT INTO watchlist_items (external_id, title, year, poster_url, added_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(String(externalId), title, year ?? null, posterUrl ?? null, now);

    const created = db
      .prepare("SELECT * FROM watchlist_items WHERE external_id = ?")
      .get(String(externalId));

    res.status(201).json(created);
  } catch (e) {
    // already exists
    if (String(e).includes("UNIQUE") || String(e).includes("PRIMARY")) {
      const existing = db
        .prepare("SELECT * FROM watchlist_items WHERE external_id = ?")
        .get(String(externalId));
      return res.status(200).json(existing);
    }
    res.status(500).json({ error: "Failed to add movie" });
  }
});


//Update movie in watchlist
app.patch("/api/watchlist/:externalId", (req, res) => {
  const { externalId } = req.params;
  const { status, userRating, notes } = req.body;

  const existing = db
    .prepare("SELECT * FROM watchlist_items WHERE external_id = ?")
    .get(String(externalId));

  if (!existing) return res.status(404).json({ error: "Not found" });

  const nextStatus = status ?? existing.status;
  const nextRating =
    userRating === undefined ? existing.user_rating : userRating;
  const nextNotes = notes ?? existing.notes;

  db.prepare(`
    UPDATE watchlist_items
    SET status = ?, user_rating = ?, notes = ?
    WHERE external_id = ?
  `).run(nextStatus, nextRating, nextNotes, String(externalId));

  const updated = db
    .prepare("SELECT * FROM watchlist_items WHERE external_id = ?")
    .get(String(externalId));

  res.json(updated);
});

//Delete movie from watchlist
app.delete("/api/watchlist/:externalId", (req, res) => {
  const { externalId } = req.params;

  const info = db
    .prepare("DELETE FROM watchlist_items WHERE external_id = ?")
    .run(String(externalId));

  res.json({ deleted: info.changes > 0 });
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});


