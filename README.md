# Movie Night Planner

React + TypeScript frontend with an Express + SQLite backend for planning a movie night.

## What It Does

- Search movies through the Express API
- Add movies to a persistent watchlist
- Update watch status, rating, priority, streaming source, planned date, and notes
- Remove movies from the list when plans change

## Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Express
- SQLite with `better-sqlite3`

## Run The App

Frontend:

```bash
npm run dev
```

Backend:

```bash
npm run server
```

The Vite frontend runs on `http://localhost:5173` by default and proxies `/api` requests to the Express server on `http://localhost:5174`.

## Environment

Server settings are read from environment variables. A starter file is included at [.env.example](c:/Users/DSU%20Student/OneDrive%20-%20Dakota%20State%20University/Spring%202026%20Classes/React%20Reasearch%20Projects/react-movie-night-planner/.env.example).

- `PORT`: Express port
- `CLIENT_ORIGIN`: allowed frontend origin for CORS
- `MOVIE_PROVIDER`: current provider, defaults to `tmdb`
- `MOVIE_SEARCH_URL`: provider endpoint override
- `MOVIE_IMAGE_BASE_URL`: TMDB image base URL
- `TMDB_API_TOKEN`: TMDB v4 Bearer token used for movie search
- `DB_PATH`: optional custom SQLite path

To enable live search with TMDB:

1. Create a TMDB account and generate an API Read Access Token.
2. Copy [server/.env.example](c:/Users/DSU%20Student/OneDrive%20-%20Dakota%20State%20University/Spring%202026%20Classes/React%20Reasearch%20Projects/react-movie-night-planner/server/.env.example) to `server/.env`.
3. Set `TMDB_API_TOKEN` in that file.
4. Start the backend with `npm run server`.

## Validation

```bash
npm run test
npm run typecheck
npm run build
```
