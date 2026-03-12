import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createServer } from "node:http";
import { createApp } from "./app.js";

function createInMemoryWatchlistStore() {
  const items = [];

  return {
    async list() {
      return [...items].sort((left, right) => right.added_at.localeCompare(left.added_at));
    },

    async create(movie) {
      const existing = items.find((item) => item.external_id === movie.externalId);

      if (existing) {
        return { row: existing, created: false };
      }

      const row = {
        external_id: movie.externalId,
        title: movie.title,
        year: movie.year,
        poster_url: movie.posterUrl,
        genre: movie.genre,
        description: movie.description,
        runtime_minutes: movie.runtimeMinutes,
        streaming_service: movie.streamingService,
        priority: movie.priority,
        planned_date: movie.plannedDate,
        status: "want",
        user_rating: null,
        notes: "",
        added_at: new Date().toISOString(),
      };

      items.push(row);
      return { row, created: true };
    },

    async update(externalId, patch) {
      const item = items.find((entry) => entry.external_id === externalId);

      if (!item) {
        return null;
      }

      if (Object.prototype.hasOwnProperty.call(patch, "status")) {
        item.status = patch.status;
      }
      if (Object.prototype.hasOwnProperty.call(patch, "userRating")) {
        item.user_rating = patch.userRating;
      }
      if (Object.prototype.hasOwnProperty.call(patch, "notes")) {
        item.notes = patch.notes;
      }
      if (Object.prototype.hasOwnProperty.call(patch, "priority")) {
        item.priority = patch.priority;
      }
      if (Object.prototype.hasOwnProperty.call(patch, "plannedDate")) {
        item.planned_date = patch.plannedDate;
      }
      if (Object.prototype.hasOwnProperty.call(patch, "streamingService")) {
        item.streaming_service = patch.streamingService;
      }

      return item;
    },

    async remove(externalId) {
      const index = items.findIndex((item) => item.external_id === externalId);

      if (index === -1) {
        return { deleted: false };
      }

      items.splice(index, 1);
      return { deleted: true };
    },
  };
}

describe("server app", () => {
  let server;
  let baseUrl;

  beforeEach(async () => {
    const app = createApp({
      watchlistStore: createInMemoryWatchlistStore(),
      movieProvider: {
        searchMovies: async (query) => [
          {
            id: "101",
            title: `${query} Result`,
            year: 2024,
            posterUrl: null,
            genre: "Sci-Fi",
            description: "A search result",
            runtimeMinutes: 123,
            streamingService: "Test Stream",
            score: null,
          },
        ],
      },
    });

    server = createServer(app);
    await new Promise((resolve) => server.listen(0, resolve));
    const address = server.address();

    if (!address || typeof address === "string") {
      throw new Error("Test server failed to start.");
    }

    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  afterEach(async () => {
    await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve(undefined))));
  });

  it("returns movie search results from the provider", async () => {
    const response = await fetch(`${baseUrl}/api/movies/search?q=Alien`);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body[0]).toMatchObject({
      id: "101",
      title: "Alien Result",
      runtimeMinutes: 123,
    });
  });

  it("validates watchlist creation and persists planner fields", async () => {
    const createResponse = await fetch(`${baseUrl}/api/watchlist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        externalId: "tt0133093",
        title: "The Matrix",
        year: 1999,
        runtimeMinutes: 136,
        streamingService: "Max",
        priority: "high",
        plannedDate: "2026-03-14",
      }),
    });

    const created = await createResponse.json();

    expect(createResponse.status).toBe(201);
    expect(created).toMatchObject({
      external_id: "tt0133093",
      priority: "high",
      planned_date: "2026-03-14",
      streaming_service: "Max",
      runtime_minutes: 136,
    });

    const patchResponse = await fetch(`${baseUrl}/api/watchlist/tt0133093`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: "watched",
        userRating: 5,
        notes: "Great crowd pick",
      }),
    });

    const patched = await patchResponse.json();

    expect(patchResponse.status).toBe(200);
    expect(patched).toMatchObject({
      status: "watched",
      user_rating: 5,
      notes: "Great crowd pick",
    });
  });

  it("rejects invalid watchlist payloads", async () => {
    const response = await fetch(`${baseUrl}/api/watchlist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        externalId: "",
        title: "",
        priority: "urgent",
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBeTruthy();
  });
});
