import cors from "cors";
import express from "express";
import { validateCreateWatchlistPayload, validateWatchlistPatch } from "./validation.js";

export function createApp({ db, movieProvider, clientOrigin = "*" }) {
  const app = express();

  app.use(cors({ origin: clientOrigin }));
  app.use(express.json());

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.get("/api/movies/search", async (req, res) => {
    const query = String(req.query.q ?? "").trim();

    if (!query) {
      return res.status(400).json({ error: "Search query is required." });
    }

    try {
      const results = await movieProvider.searchMovies(query);
      res.json(results);
    } catch (error) {
      console.error("Movie search failed", error);
      res.status(502).json({ error: error instanceof Error ? error.message : "Failed to search movies." });
    }
  });

  app.get("/api/watchlist", (_req, res) => {
    const rows = db.prepare("SELECT * FROM watchlist_items ORDER BY added_at DESC").all();
    res.json(rows);
  });

  app.post("/api/watchlist", (req, res) => {
    const validated = validateCreateWatchlistPayload(req.body);

    if (!validated.value) {
      return res.status(400).json({ error: validated.error });
    }

    const movie = validated.value;
    const now = new Date().toISOString();

    try {
      db.prepare(`
        INSERT INTO watchlist_items (
          external_id,
          title,
          year,
          poster_url,
          genre,
          description,
          runtime_minutes,
          streaming_service,
          priority,
          planned_date,
          added_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        movie.externalId,
        movie.title,
        movie.year,
        movie.posterUrl,
        movie.genre,
        movie.description,
        movie.runtimeMinutes,
        movie.streamingService,
        movie.priority,
        movie.plannedDate,
        now,
      );

      const created = db.prepare("SELECT * FROM watchlist_items WHERE external_id = ?").get(movie.externalId);
      res.status(201).json(created);
    } catch (error) {
      if (String(error).includes("UNIQUE") || String(error).includes("PRIMARY")) {
        const existing = db.prepare("SELECT * FROM watchlist_items WHERE external_id = ?").get(movie.externalId);
        return res.status(200).json(existing);
      }

      console.error("Failed to add watchlist movie", error);
      res.status(500).json({ error: "Failed to add movie." });
    }
  });

  app.patch("/api/watchlist/:externalId", (req, res) => {
    const externalId = String(req.params.externalId);
    const existing = db.prepare("SELECT * FROM watchlist_items WHERE external_id = ?").get(externalId);

    if (!existing) {
      return res.status(404).json({ error: "Not found." });
    }

    const validated = validateWatchlistPatch(req.body);

    if (!validated.value) {
      return res.status(400).json({ error: validated.error });
    }

    const patch = validated.value;
    const nextStatus = patch.status ?? existing.status;
    const nextRating = Object.prototype.hasOwnProperty.call(patch, "userRating") ? patch.userRating : existing.user_rating;
    const nextNotes = Object.prototype.hasOwnProperty.call(patch, "notes") ? patch.notes : existing.notes;
    const nextPriority = patch.priority ?? existing.priority;
    const nextPlannedDate = Object.prototype.hasOwnProperty.call(patch, "plannedDate")
      ? patch.plannedDate
      : existing.planned_date;
    const nextStreamingService = Object.prototype.hasOwnProperty.call(patch, "streamingService")
      ? patch.streamingService
      : existing.streaming_service;

    db.prepare(`
      UPDATE watchlist_items
      SET status = ?, user_rating = ?, notes = ?, priority = ?, planned_date = ?, streaming_service = ?
      WHERE external_id = ?
    `).run(
      nextStatus,
      nextRating,
      nextNotes,
      nextPriority,
      nextPlannedDate,
      nextStreamingService,
      externalId,
    );

    const updated = db.prepare("SELECT * FROM watchlist_items WHERE external_id = ?").get(externalId);
    res.json(updated);
  });

  app.delete("/api/watchlist/:externalId", (req, res) => {
    const result = db.prepare("DELETE FROM watchlist_items WHERE external_id = ?").run(String(req.params.externalId));
    res.json({ deleted: result.changes > 0 });
  });

  return app;
}
