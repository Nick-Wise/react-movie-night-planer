import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Browse from "./pages/Browse";
import Watchlist from "./pages/Watchlist";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-bg-main text-text-primary">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Browse />} />
            <Route path="/watchlist" element={<Watchlist />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
