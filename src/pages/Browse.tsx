import { useEffect, useState } from "react";
import { searchMovies } from "../api/movies";
import { addToWatchlist, getWatchlist } from "../api/watchlist";
import MovieList from "../components/MovieList";
import StateMessage from "../components/StateMessage";
import type { MovieSearchResult } from "../types";

const DEFAULT_QUERY = "Spider-Man";
const SEARCH_DEBOUNCE_MS = 350;

function Browse() {
  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [movies, setMovies] = useState<MovieSearchResult[]>([]);
  const [watchlistIds, setWatchlistIds] = useState<Set<string>>(new Set());
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    void loadWatchlistIds();
  }, []);

  useEffect(() => {
    const trimmedQuery = query.trim() || DEFAULT_QUERY;
    const timeoutId = window.setTimeout(() => {
      void runSearch(trimmedQuery);
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timeoutId);
  }, [query]);

  async function loadWatchlistIds() {
    try {
      const items = await getWatchlist();
      setWatchlistIds(new Set(items.map((item) => item.externalId)));
    } catch (watchlistError) {
      setError(watchlistError instanceof Error ? watchlistError.message : "Unable to load the watchlist.");
    }
  }

  async function runSearch(nextQuery: string) {
    setLoading(true);
    setError("");

    try {
      const results = await searchMovies(nextQuery);
      setMovies(results);
    } catch (searchError) {
      setError(searchError instanceof Error ? searchError.message : "Unable to search movies right now.");
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(movie: MovieSearchResult) {
    setPendingIds((current) => new Set(current).add(movie.id));

    try {
      await addToWatchlist({
        externalId: movie.id,
        title: movie.title,
        year: movie.year,
        posterUrl: movie.posterUrl,
        genre: movie.genre,
        description: movie.description,
        runtimeMinutes: movie.runtimeMinutes,
        streamingService: movie.streamingService,
      });

      setWatchlistIds((current) => new Set(current).add(movie.id));
    } catch (addError) {
      setError(addError instanceof Error ? addError.message : "Unable to add this movie.");
    } finally {
      setPendingIds((current) => {
        const next = new Set(current);
        next.delete(movie.id);
        return next;
      });
    }
  }

  const activeQuery = query.trim() || DEFAULT_QUERY;

  return (
    <section className="space-y-8">
      <div className="overflow-hidden rounded-[2rem] border border-border bg-[radial-gradient(circle_at_top_left,_rgba(168,85,247,0.28),_transparent_35%),linear-gradient(135deg,_rgba(28,34,48,0.96),_rgba(16,18,27,0.96))] p-8 shadow-[0_24px_70px_rgba(0,0,0,0.3)]">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent-soft">Movie Night</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight sm:text-5xl">
          Search for a film, build the lineup, and keep the whole night organized.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-text-secondary">
          Search live movie data through the Express API, then save titles into a persistent watchlist you can rank,
          schedule, and prune.
        </p>

        <div className="mt-8 flex flex-col gap-3 md:flex-row">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by title, franchise, or year"
            className="flex-1 rounded-full border border-border bg-bg-main px-5 py-4 text-base text-text-primary outline-none transition focus:border-accent-primary"
          />
          <div className="rounded-full border border-border bg-bg-main px-5 py-4 text-sm font-semibold text-text-secondary">
            Auto-searching
          </div>
        </div>
      </div>

      {error ? <StateMessage title="Search issue" description={error} tone="danger" /> : null}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Search Results</h2>
          <p className="text-sm text-text-secondary">
            {loading ? "Searching..." : `Showing ${movies.length} result${movies.length === 1 ? "" : "s"} for "${activeQuery}"`}
          </p>
        </div>
      </div>

      {loading ? (
        <StateMessage title="Loading results" description="Pulling movie matches from the search API." />
      ) : movies.length > 0 ? (
        <MovieList
          mode="browse"
          movies={movies}
          watchlistIds={watchlistIds}
          pendingIds={pendingIds}
          onAdd={handleAdd}
        />
      ) : (
        <StateMessage
          title="No matches"
          description='Try a broader title like "Alien", "Batman", or "Mission Impossible".'
        />
      )}
    </section>
  );
}

export default Browse;
