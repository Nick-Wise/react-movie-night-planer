import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Browse from "./pages/Browse";
import Watchlist from "./pages/Watchlist";
import About from "./pages/About";

const FEATURES = {
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
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={<Browse movies={movies} features={FEATURES} />}
        />
        <Route path="/watchlist" element={<Watchlist movies={movies} />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
