import serverless from "serverless-http";
import { createApp } from "../server/app.js";
import { getServerConfig } from "../server/config.js";
import { createMovieProvider } from "../server/movieProvider.js";
import { createSupabaseWatchlistStore } from "../server/watchlistStore.js";

const config = getServerConfig();

const app = createApp({
  watchlistStore: createSupabaseWatchlistStore(config),
  movieProvider: createMovieProvider(config),
  clientOrigin: config.clientOrigin,
});

export default serverless(app);
