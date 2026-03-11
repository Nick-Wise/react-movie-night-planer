import { describe, expect, it } from "vitest";
import { mapWatchlistRow } from "./watchlist";

describe("mapWatchlistRow", () => {
  it("maps snake_case API rows into the frontend watchlist shape", () => {
    const mapped = mapWatchlistRow({
      external_id: "tt0133093",
      title: "The Matrix",
      year: 1999,
      poster_url: "poster.jpg",
      genre: "Sci-Fi",
      description: "Neo learns the truth.",
      runtime_minutes: 136,
      streaming_service: "Max",
      priority: "high",
      planned_date: "2026-03-14",
      status: "want",
      user_rating: 4,
      notes: "Saturday pick",
      added_at: "2026-03-11T12:00:00.000Z",
    });

    expect(mapped).toEqual({
      externalId: "tt0133093",
      title: "The Matrix",
      year: 1999,
      posterUrl: "poster.jpg",
      genre: "Sci-Fi",
      description: "Neo learns the truth.",
      runtimeMinutes: 136,
      streamingService: "Max",
      priority: "high",
      plannedDate: "2026-03-14",
      status: "want",
      userRating: 4,
      notes: "Saturday pick",
      addedAt: "2026-03-11T12:00:00.000Z",
    });
  });
});
