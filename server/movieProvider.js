function normalizeTmdbResult(item, imageBaseUrl) {
  return {
    id: String(item.id),
    title: item.title ?? item.original_title ?? "Untitled",
    year: item.release_date ? new Date(item.release_date).getUTCFullYear() : null,
    posterUrl: item.poster_path ? `${imageBaseUrl}${item.poster_path}` : null,
    genre: null,
    description: item.overview ?? null,
    runtimeMinutes: null,
    streamingService: null,
    score: typeof item.vote_average === "number" ? Math.round(item.vote_average * 10) : null,
  };
}

export function createMovieProvider(config) {
  if (config.movieProvider !== "tmdb") {
    throw new Error(`Unsupported movie provider "${config.movieProvider}"`);
  }

  if (!config.tmdbApiToken) {
    throw new Error("Missing TMDB_API_TOKEN environment variable.");
  }

  return {
    async searchMovies(query, fetchImpl = fetch) {
      const params = new URLSearchParams({
        query,
        include_adult: "false",
        language: "en-US",
        page: "1",
      });

      const response = await fetchImpl(`${config.movieSearchUrl}?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${config.tmdbApiToken}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Movie provider request failed.");
      }

      const payload = await response.json();

      if (!Array.isArray(payload.results)) {
        return [];
      }

      return payload.results
        .filter((item) => item?.id)
        .map((item) => normalizeTmdbResult(item, config.movieImageBaseUrl));
    },
  };
}
