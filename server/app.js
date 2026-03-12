import cors from "cors";
import express from "express";
import { validateCreateWatchlistPayload, validateWatchlistPatch } from "./validation.js";

export function createApp({ watchlistStore, movieProvider, clientOrigin = "*" }) {
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

  app.get("/api/watchlist", async (_req, res) => {
    try {
      const rows = await watchlistStore.list();
      res.json(rows);
    } catch (error) {
      console.error("Failed to load watchlist", error);
      res.status(500).json({ error: "Failed to load watchlist." });
    }
  });

  app.post("/api/watchlist", async (req, res) => {
    const validated = validateCreateWatchlistPayload(req.body);

    if (!validated.value) {
      return res.status(400).json({ error: validated.error });
    }

    const movie = validated.value;

    try {
      const result = await watchlistStore.create(movie);
      res.status(result.created ? 201 : 200).json(result.row);
    } catch (error) {
      console.error("Failed to add watchlist movie", error);
      res.status(500).json({ error: "Failed to add movie." });
    }
  });

  app.patch("/api/watchlist/:externalId", async (req, res) => {
    const externalId = String(req.params.externalId);

    const validated = validateWatchlistPatch(req.body);

    if (!validated.value) {
      return res.status(400).json({ error: validated.error });
    }

    try {
      const updated = await watchlistStore.update(externalId, validated.value);

      if (!updated) {
        return res.status(404).json({ error: "Not found." });
      }

      res.json(updated);
    } catch (error) {
      console.error("Failed to update watchlist movie", error);
      res.status(500).json({ error: "Failed to update movie." });
    }
  });

  app.delete("/api/watchlist/:externalId", async (req, res) => {
    try {
      const result = await watchlistStore.remove(String(req.params.externalId));
      res.json(result);
    } catch (error) {
      console.error("Failed to remove watchlist movie", error);
      res.status(500).json({ error: "Failed to remove movie." });
    }
  });

  return app;
}
