import type { WatchlistItem, WatchlistPayload } from "../types";

export type WatchlistApiRow = {
  external_id: string;
  title: string;
  year: number | null;
  poster_url: string | null;
  genre: string | null;
  description: string | null;
  runtime_minutes: number | null;
  streaming_service: string | null;
  priority: WatchlistItem["priority"];
  planned_date: string | null;
  status: WatchlistItem["status"];
  user_rating: number | null;
  notes: string | null;
  added_at: string;
};

export function mapWatchlistRow(row: WatchlistApiRow): WatchlistItem {
  return {
    externalId: row.external_id,
    title: row.title,
    year: row.year,
    posterUrl: row.poster_url,
    genre: row.genre,
    description: row.description,
    runtimeMinutes: row.runtime_minutes,
    streamingService: row.streaming_service,
    priority: row.priority,
    plannedDate: row.planned_date,
    status: row.status,
    userRating: row.user_rating,
    notes: row.notes ?? "",
    addedAt: row.added_at,
  };
}

export async function getWatchlist(): Promise<WatchlistItem[]> {
  const response = await fetch("/api/watchlist");
  if (!response.ok) {
    throw new Error("Failed to load the watchlist.");
  }

  const rows = (await response.json()) as WatchlistApiRow[];
  return rows.map(mapWatchlistRow);
}

export async function addToWatchlist(payload: WatchlistPayload): Promise<WatchlistItem> {
  const response = await fetch("/api/watchlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? "Failed to add movie to watchlist.");
  }

  return mapWatchlistRow((await response.json()) as WatchlistApiRow);
}

export async function removeFromWatchlist(externalId: string): Promise<void> {
  const response = await fetch(`/api/watchlist/${externalId}`, { method: "DELETE" });

  if (!response.ok) {
    throw new Error("Failed to remove movie from watchlist.");
  }
}

export async function updateWatchlistItem(
  externalId: string,
  patch: Partial<Pick<WatchlistItem, "status" | "userRating" | "notes" | "priority" | "plannedDate" | "streamingService">>,
): Promise<WatchlistItem> {
  const response = await fetch(`/api/watchlist/${externalId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? "Failed to update watchlist movie.");
  }

  return mapWatchlistRow((await response.json()) as WatchlistApiRow);
}
