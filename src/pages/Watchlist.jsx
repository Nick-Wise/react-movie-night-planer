import { useEffect, useState } from "react";
import MovieList from "../components/MovieList";

function adaptWatchlistRow(row) {
  return {
    id: row.external_id,                 // <-- important
    title: row.title,
    genre: "Watchlist",                  // placeholder since DB doesn't have genre
    posterUrl: row.poster_url,
    rating: row.user_rating,             // StarRating uses this
    watched: row.status === "watched",   // Status pill uses this
  };
}

export default function WatchlistPage({ features }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/watchlist");
      if (!res.ok) throw new Error("Failed to load watchlist");
      const rows = await res.json();
      setMovies(rows.map(adaptWatchlistRow));
    } catch (e) {
      setError(e.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove(externalId) {
    await fetch(`/api/watchlist/${externalId}`, { method: "DELETE" });
    await load();
  }

  useEffect(() => {
    load();
  }, []);

  if (loading)
  return (
    <div className="max-w-6xl mx-auto p-6 text-[var(--color-text-primary)]">
      Loading...
    </div>
  );

if (error)
  return (
    <div className="max-w-6xl mx-auto p-6 text-[var(--color-text-primary)]">
      <div className="text-red-400">{error}</div>
    </div>
  );

return (
  <div className="max-w-8xl mx-auto p-6 text-[var(--color-text-primary)]">
    <h1 className="text-4xl font-bold mb-4 text-center">Watchlist</h1>
    <MovieList movies={movies} features={features} onRemove={handleRemove} />
  </div>
);
}