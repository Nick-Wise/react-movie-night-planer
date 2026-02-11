import MovieCard from "./MovieCard";

function MovieList({ movies, features, onRemove }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          features={features}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}

export default MovieList;
