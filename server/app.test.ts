import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createServer } from "node:http";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createApp } from "./app.js";
import { createDatabase } from "./db.js";

describe("server app", () => {
  let server;
  let db;
  let baseUrl;
  let tempDir;

  beforeEach(async () => {
    tempDir = mkdtempSync(join(tmpdir(), "movie-night-"));
    db = createDatabase(join(tempDir, "watchlist.db"));

    const app = createApp({
      db,
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
    db.close();
    rmSync(tempDir, { recursive: true, force: true });
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
