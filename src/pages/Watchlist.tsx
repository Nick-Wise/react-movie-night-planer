import { useEffect, useState } from "react";
import { getWatchlist, removeFromWatchlist, updateWatchlistItem } from "../api/watchlist";
import MovieList from "../components/MovieList";
import StateMessage from "../components/StateMessage";
import type { WatchlistItem } from "../types";

function Watchlist() {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    void loadItems();
  }, []);

  async function loadItems() {
    setLoading(true);
    setError("");

    try {
      setItems(await getWatchlist());
    } catch (watchlistError) {
      setError(watchlistError instanceof Error ? watchlistError.message : "Unable to load watchlist.");
    } finally {
      setLoading(false);
    }
  }

  async function withPending(externalId: string, action: () => Promise<void>) {
    setPendingIds((current) => new Set(current).add(externalId));

    try {
      await action();
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "Unable to update watchlist.");
    } finally {
      setPendingIds((current) => {
        const next = new Set(current);
        next.delete(externalId);
        return next;
      });
    }
  }

  async function handleRemove(externalId: string) {
    await withPending(externalId, async () => {
      await removeFromWatchlist(externalId);
      setItems((current) => current.filter((item) => item.externalId !== externalId));
    });
  }

  async function handlePatch(
    externalId: string,
    patch: Partial<Pick<WatchlistItem, "status" | "userRating" | "notes" | "priority" | "plannedDate" | "streamingService">>,
  ) {
    await withPending(externalId, async () => {
      const updated = await updateWatchlistItem(externalId, patch);
      setItems((current) => current.map((item) => (item.externalId === externalId ? updated : item)));
    });
  }

  const watchedCount = items.filter((item) => item.status === "watched").length;
  const scheduledCount = items.filter((item) => item.plannedDate).length;

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent-soft">Watchlist</p>
          <h1 className="mt-2 text-4xl font-black">Plan the night from one queue.</h1>
        </div>
        <div className="rounded-[1.5rem] border border-border bg-bg-surface px-5 py-4 text-sm text-text-secondary">
          {items.length} saved • {scheduledCount} scheduled • {watchedCount} watched
        </div>
      </div>

      {error ? <StateMessage title="Watchlist issue" description={error} tone="danger" /> : null}

      {loading ? (
        <StateMessage title="Loading watchlist" description="Fetching your saved movies and planner details." />
      ) : items.length > 0 ? (
        <MovieList mode="watchlist" movies={items} pendingIds={pendingIds} onRemove={handleRemove} onPatch={handlePatch} />
      ) : (
        <StateMessage
          title="Watchlist is empty"
          description="Search for a movie on the home page and add it to start planning the night."
        />
      )}
    </section>
  );
}

export default Watchlist;
