export type MovieSearchResult = {
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

export type WatchlistStatus = "want" | "watching" | "watched";
export type WatchlistPriority = "low" | "medium" | "high";

export type WatchlistItem = {
  externalId: string;
  title: string;
  year: number | null;
  posterUrl: string | null;
  genre: string | null;
  description: string | null;
  runtimeMinutes: number | null;
  streamingService: string | null;
  priority: WatchlistPriority;
  plannedDate: string | null;
  status: WatchlistStatus;
  userRating: number | null;
  notes: string;
  addedAt: string;
};

export type WatchlistPayload = {
  externalId: string;
  title: string;
  year: number | null;
  posterUrl: string | null;
  genre: string | null;
  description: string | null;
  runtimeMinutes: number | null;
  streamingService: string | null;
  priority?: WatchlistPriority;
  plannedDate?: string | null;
};
