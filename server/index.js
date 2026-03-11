import db from "./db.js";
import { createApp } from "./app.js";
import { getServerConfig } from "./config.js";
import { createMovieProvider } from "./movieProvider.js";

const config = getServerConfig();
const movieProvider = createMovieProvider(config);
const app = createApp({
  db,
  movieProvider,
  clientOrigin: config.clientOrigin,
});

app.listen(config.port, () => {
  console.log(`API running on http://localhost:${config.port}`);
});
