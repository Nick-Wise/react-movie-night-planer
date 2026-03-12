import type { MovieSearchResult, WatchlistItem } from "../types";
import StarRating from "./StarRating";

type BrowseMovieCardProps = {
  mode: "browse";
  movie: MovieSearchResult;
  isInWatchlist: boolean;
  isPending?: boolean;
  onAdd: (movie: MovieSearchResult) => Promise<void> | void;
};

type WatchlistMovieCardProps = {
  mode: "watchlist";
  movie: WatchlistItem;
  isPending?: boolean;
  onRemove: (externalId: string) => Promise<void> | void;
  onPatch: (
    externalId: string,
    patch: Partial<Pick<WatchlistItem, "status" | "userRating" | "notes" | "priority" | "plannedDate" | "streamingService">>,
  ) => Promise<void> | void;
};

type MovieCardProps = BrowseMovieCardProps | WatchlistMovieCardProps;

const statusOptions: Array<WatchlistItem["status"]> = ["want", "watching", "watched"];
const priorityOptions: Array<WatchlistItem["priority"]> = ["low", "medium", "high"];

function Poster({ src, alt }: { src?: string | null; alt: string }) {
  if (!src) {
    return (
      <div className="flex aspect-[2/3] items-center justify-center rounded-2xl border border-dashed border-border bg-bg-main/60 text-sm text-text-secondary">
        Poster unavailable
      </div>
    );
  }

  return (
    <div className="aspect-[2/3] overflow-hidden rounded-2xl bg-bg-main/60">
      <img src={src} alt={alt} className="h-full w-full object-cover" />
    </div>
  );
}

function MetaLine({ movie }: { movie: MovieSearchResult | WatchlistItem }) {
  const parts = [movie.year, movie.genre, movie.runtimeMinutes ? `${movie.runtimeMinutes} min` : null].filter(Boolean);
  return <p className="mt-1 text-sm text-text-secondary">{parts.join(" | ") || "Movie"}</p>;
}

function BrowseActions({
  movie,
  isInWatchlist,
  isPending,
  onAdd,
}: {
  movie: MovieSearchResult;
  isInWatchlist: boolean;
  isPending: boolean;
  onAdd: (movie: MovieSearchResult) => Promise<void> | void;
}) {
  return (
    <button
      type="button"
      onClick={() => onAdd(movie)}
      disabled={isInWatchlist || isPending}
      className="mt-5 rounded-full bg-accent-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isInWatchlist ? "In watchlist" : isPending ? "Adding..." : "Add to watchlist"}
    </button>
  );
}

type WatchlistControlsProps = {
  movie: WatchlistItem;
  isPending: boolean;
  onRemove: (externalId: string) => Promise<void> | void;
  onPatch: (
    externalId: string,
    patch: Partial<Pick<WatchlistItem, "status" | "userRating" | "notes" | "priority" | "plannedDate" | "streamingService">>,
  ) => Promise<void> | void;
};

function WatchlistControls({ movie, isPending, onRemove, onPatch }: WatchlistControlsProps) {
  return (
    <div className="mt-5 space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-2 block font-semibold text-text-secondary">Status</span>
          <select
            value={movie.status}
            onChange={(event) => onPatch(movie.externalId, { status: event.target.value as WatchlistItem["status"] })}
            disabled={isPending}
            className="w-full rounded-2xl border border-border bg-bg-main px-4 py-3 text-text-primary outline-none transition focus:border-accent-primary"
          >
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm">
          <span className="mb-2 block font-semibold text-text-secondary">Priority</span>
          <select
            value={movie.priority}
            onChange={(event) => onPatch(movie.externalId, { priority: event.target.value as WatchlistItem["priority"] })}
            disabled={isPending}
            className="w-full rounded-2xl border border-border bg-bg-main px-4 py-3 text-text-primary outline-none transition focus:border-accent-primary"
          >
            {priorityOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-2 block font-semibold text-text-secondary">Planned date</span>
          <input
            type="date"
            value={movie.plannedDate ?? ""}
            onChange={(event) => onPatch(movie.externalId, { plannedDate: event.target.value || null })}
            disabled={isPending}
            className="w-full rounded-2xl border border-border bg-bg-main px-4 py-3 text-text-primary outline-none transition focus:border-accent-primary"
          />
        </label>

        <label className="block text-sm">
          <span className="mb-2 block font-semibold text-text-secondary">Streaming service</span>
          <input
            key={`${movie.externalId}-streaming-${movie.streamingService ?? ""}`}
            type="text"
            defaultValue={movie.streamingService ?? ""}
            onBlur={(event) => {
              const nextValue = event.target.value.trim() || null;
              if (nextValue !== movie.streamingService) {
                void onPatch(movie.externalId, { streamingService: nextValue });
              }
            }}
            disabled={isPending}
            className="w-full rounded-2xl border border-border bg-bg-main px-4 py-3 text-text-primary outline-none transition focus:border-accent-primary"
            placeholder="Netflix, Max, Disney+, Blu-ray..."
          />
        </label>
      </div>

      <label className="block text-sm">
        <span className="mb-2 block font-semibold text-text-secondary">Your rating</span>
        <select
          value={movie.userRating ?? ""}
          onChange={(event) =>
            onPatch(movie.externalId, {
              userRating: event.target.value === "" ? null : Number(event.target.value),
            })
          }
          disabled={isPending}
          className="w-full rounded-2xl border border-border bg-bg-main px-4 py-3 text-text-primary outline-none transition focus:border-accent-primary"
        >
          <option value="">Not rated</option>
          {[1, 2, 3, 4, 5].map((option) => (
            <option key={option} value={option}>
              {option}/5
            </option>
          ))}
        </select>
        <div className="mt-2">
          <StarRating value={movie.userRating} />
        </div>
      </label>

      <label className="block text-sm">
        <span className="mb-2 block font-semibold text-text-secondary">Notes</span>
        <textarea
          key={`${movie.externalId}-notes-${movie.notes}`}
          rows={3}
          defaultValue={movie.notes}
          onBlur={(event) => {
            if (event.target.value !== movie.notes) {
              void onPatch(movie.externalId, { notes: event.target.value });
            }
          }}
          disabled={isPending}
          className="w-full rounded-2xl border border-border bg-bg-main px-4 py-3 text-text-primary outline-none transition focus:border-accent-primary"
          placeholder="Who is coming, snacks, why it made the list..."
        />
      </label>

      <button
        type="button"
        onClick={() => onRemove(movie.externalId)}
        disabled={isPending}
        className="w-full rounded-full border border-border px-4 py-3 text-sm font-semibold text-text-primary transition hover:border-danger hover:text-danger disabled:cursor-not-allowed disabled:opacity-60"
      >
        Remove from watchlist
      </button>
    </div>
  );
}

function MovieCard(props: MovieCardProps) {
  const isPending = props.isPending ?? false;
  const movie = props.movie;

  return (
    <article className="flex h-full flex-col rounded-[1.75rem] border border-border bg-bg-surface p-4 shadow-[0_18px_50px_rgba(0,0,0,0.22)]">
      <Poster src={movie.posterUrl} alt={`${movie.title} poster`} />

      <div className="mt-4 flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold leading-tight">{movie.title}</h2>
            <MetaLine movie={movie} />
          </div>
          {"score" in movie && movie.score ? (
            <span className="rounded-full bg-bg-main px-3 py-1 text-xs font-semibold text-text-secondary">
              {movie.score}/100
            </span>
          ) : null}
        </div>

        {movie.streamingService ? (
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.15em] text-accent-soft">
            {movie.streamingService}
          </p>
        ) : null}

        {movie.description ? (
          <p className="mt-3 line-clamp-4 text-sm leading-6 text-text-secondary">{movie.description}</p>
        ) : (
          <p className="mt-3 text-sm leading-6 text-text-secondary">No summary available yet.</p>
        )}

        {props.mode === "browse" ? (
          <BrowseActions
            movie={props.movie}
            isInWatchlist={props.isInWatchlist}
            isPending={isPending}
            onAdd={props.onAdd}
          />
        ) : (
          <WatchlistControls movie={props.movie} isPending={isPending} onRemove={props.onRemove} onPatch={props.onPatch} />
        )}
      </div>
    </article>
  );
}

export default MovieCard;
