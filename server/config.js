import { config as loadEnv } from "dotenv";

loadEnv();

export function getServerConfig() {
  return {
    port: Number(process.env.PORT ?? 5174),
    clientOrigin: process.env.CLIENT_ORIGIN ?? "*",
    movieProvider: process.env.MOVIE_PROVIDER ?? "tmdb",
    movieSearchUrl: process.env.MOVIE_SEARCH_URL ?? "https://api.themoviedb.org/3/search/movie",
    movieImageBaseUrl: process.env.MOVIE_IMAGE_BASE_URL ?? "https://image.tmdb.org/t/p/w500",
    tmdbApiToken: process.env.TMDB_API_TOKEN ?? "",
    supabaseUrl: process.env.SUPABASE_URL ?? "",
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
    supabaseWatchlistTable: process.env.SUPABASE_WATCHLIST_TABLE ?? "watchlist_items",
  };
}
