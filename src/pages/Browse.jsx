import { useEffect, useMemo, useState } from "react";
import MovieList from "../components/MovieList";

export default function Browse({ movies, features }) {
  const [watchlistIds, setWatchlistIds] = useState(new Set());
  const [error, setError] = useState("");

  async function loadWatchlistIds() {
    setError("");
    try {
      const res = await fetch("/api/watchlist");
      if (!res.ok) throw new Error("Failed to load watchlist");
      const rows = await res.json();
      setWatchlistIds(new Set(rows.map((r) => String(r.external_id))));
    } catch (e) {
      setError(e.message || "Unknown error");
    }
  }

  useEffect(() => {
    loadWatchlistIds();
  }, []);

  const isInWatchlist = useMemo(() => {
    return (movieId) => watchlistIds.has(String(movieId));
  }, [watchlistIds]);

  async function handleAdd(movie) {
    // Map your current movie object -> backend fields
    await fetch("/api/watchlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        externalId: movie.id,
        title: movie.title,
        year: movie.year ?? null,
        posterUrl: movie.posterUrl ?? null,
      }),
    });

    // Update UI immediately (no full reload needed)
    setWatchlistIds((prev) => {
      const next = new Set(prev);
      next.add(String(movie.id));
      return next;
    });
  }

  return (
    <div className="max-w-8xl mx-auto p-6 text-[var(--color-text-primary)]">
      <h1 className="text-4xl font-bold mb-4 text-center">Browse Movies</h1>

      {error && <div className="mb-4 text-red-400">{error}</div>}

      <MovieList
        movies={movies}
        features={features}
        onAdd={handleAdd}
        isInWatchlist={isInWatchlist}
      />
    </div>
  );
}
