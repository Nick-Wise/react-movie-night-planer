import React from "react";
import MovieList from "./components/MovieList";


const FEATURES ={
  topPicksBadge: false,
};

const movies = [
  {
    id: 1,
    title: "Inception",
    genre: "Sci-Fi",
    posterUrl:
      "https://m.media-amazon.com/images/I/912AErFSBHL._AC_UF894,1000_QL80_.jpg",
    rating: 4.5,
    watched: true,
    description: "A thief enters dreams to steal secrets.",
  },
  {
    id: 2,
    title: "Spider-Man: Into the Spider-Verse",
    genre: "Animation",
    posterUrl:
      "https://m.media-amazon.com/images/I/91F2HZa97jL._AC_UF1000,1000_QL80_.jpg",
    rating: null,
    watched: false,
    description: "Miles discovers multiple Spider-People across universes.",
  },
  {
    id: 3,
    title: "The Dark Knight",
    genre: "Action",
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BMDQ5MWU2YWUtNTQ4OC00Njk5LWI0NzctMjM4OGZiNmZmNGViXkEyXkFqcGc@._V1_.jpg",
    rating: 5,
    watched: true,
    description: "Batman faces the Joker in Gotham.",
  },
];

function App() {
  return (
    <div className="min-h-screen flex justify-center">
      <div className="w-full max-w-6xl px-4">
        <MovieList movies={movies} features ={FEATURES} />
      </div>
    </div>
  );
}

export default App;
