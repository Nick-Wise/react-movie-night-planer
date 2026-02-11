export async function getWatchlist() {
  const res = await fetch("/api/watchlist");
  if (!res.ok) throw new Error("Failed to load watchlist");
  return res.json();
}

export async function addToWatchlist({ externalId, title, year, posterUrl }) {
  const res = await fetch("/api/watchlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ externalId, title, year, posterUrl }),
  });
  if (!res.ok) throw new Error("Failed to add movie");
  return res.json();
}

export async function removeFromWatchlist(externalId) {
  const res = await fetch(`/api/watchlist/${externalId}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete movie");
  return res.json();
}

export async function updateWatchlistItem(externalId, patch) {
  const res = await fetch(`/api/watchlist/${externalId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error("Failed to update movie");
  return res.json();
}
