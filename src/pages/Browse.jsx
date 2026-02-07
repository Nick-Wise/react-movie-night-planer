import MovieList from "../components/MovieList";

export default function Browse({ movies, features }) {
  return (
    <div className="max-w-6xl mx-auto p-6 text-[var(--color-text-primary)]">
      <h1 className="text-3xl font-bold mb-4 text-center">Browse Movies</h1>
      <MovieList movies={movies} features={features} />
    </div>
  );
}