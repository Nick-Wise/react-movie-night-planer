import type { MovieSearchResult, WatchlistItem } from "../types";
import MovieCard from "./MovieCard";

type BrowseMovieListProps = {
  mode: "browse";
  movies: MovieSearchResult[];
  pendingIds?: Set<string>;
  watchlistIds: Set<string>;
  onAdd: (movie: MovieSearchResult) => Promise<void> | void;
};

type WatchlistMovieListProps = {
  mode: "watchlist";
  movies: WatchlistItem[];
  pendingIds?: Set<string>;
  onRemove: (externalId: string) => Promise<void> | void;
  onPatch: (
    externalId: string,
    patch: Partial<Pick<WatchlistItem, "status" | "userRating" | "notes" | "priority" | "plannedDate" | "streamingService">>,
  ) => Promise<void> | void;
};

type MovieListProps = BrowseMovieListProps | WatchlistMovieListProps;

function MovieList(props: MovieListProps) {
  if (props.mode === "browse") {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {props.movies.map((movie) => (
          <MovieCard
            key={movie.id}
            mode="browse"
            movie={movie}
            isInWatchlist={props.watchlistIds.has(movie.id)}
            isPending={props.pendingIds?.has(movie.id)}
            onAdd={props.onAdd}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {props.movies.map((movie) => (
        <MovieCard
          key={movie.externalId}
          mode="watchlist"
          movie={movie}
          isPending={props.pendingIds?.has(movie.externalId)}
          onRemove={props.onRemove}
          onPatch={props.onPatch}
        />
      ))}
    </div>
  );
}

export default MovieList;
