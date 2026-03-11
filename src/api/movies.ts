import type { MovieSearchResult } from "../types";

type MovieSearchApiResult = {
  id: string;
  title: string;
  year: number | null;
  posterUrl: string | null;
  genre: string | null;
  description: string | null;
  runtimeMinutes: number | null;
  streamingService: string | null;
  score: number | null;
};

export async function searchMovies(query: string): Promise<MovieSearchResult[]> {
  const trimmedQuery = query.trim();
  const response = await fetch(`/api/movies/search?q=${encodeURIComponent(trimmedQuery)}`);

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? "Failed to search movies.");
  }

  return (await response.json()) as MovieSearchApiResult[];
}
