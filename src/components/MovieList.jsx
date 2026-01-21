import MovieCard from "./MovieCard";


function MovieList({ movies, features }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie = {movie} features = {features}/>
      ))}
    </div>
  );
}

export default MovieList;
