import { createApp } from "./app.js";
import { getServerConfig } from "./config.js";
import { createMovieProvider } from "./movieProvider.js";
import { createSupabaseWatchlistStore } from "./watchlistStore.js";

const config = getServerConfig();
const movieProvider = createMovieProvider(config);
const watchlistStore = createSupabaseWatchlistStore(config);
const app = createApp({
  watchlistStore,
  movieProvider,
  clientOrigin: config.clientOrigin,
});

app.listen(config.port, () => {
  console.log(`API running on http://localhost:${config.port}`);
});
