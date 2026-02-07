import React from "react";
import StarRating from "./StarRating";

function Poster({src, alt}) {
    if (!src) {
    return (
      <div className="aspect-[2/3] rounded-md bg-black/20 flex items-center justify-center text-sm opacity-70">
        No poster
      </div>
    );
  }

  return (
    <div className="aspect-[2/3] overflow-hidden rounded-md bg-black/20">
      <img src={src} alt={alt} className="h-full w-full object-cover" />
    </div>
  );
}

function StatusPill({ watched }) {
  return (
    <div className="mt-2">
      <span
        className={[
          "inline-flex items-center rounded-full px-3 py-1 text-sm",
          watched ? "bg-white/10" : "bg-white/5 opacity-90",
        ].join(" ")}
      >
        {watched ? "Watched" : "Not watched"}
      </span>
    </div>
  );
}


function TopPickBadge({ show }) {
  if (!show) return null;

  return (
    <div className="mt-2">
      <span className="inline-flex items-center rounded-full px-3 py-1 text-xs bg-white/10">
        Top Pick
      </span>
    </div>
  );
  }

function MovieCard({ movie, features }) {
  const title = movie?.title ?? "Untitled";
  const genre = movie?.genre ?? "Unknown genre";
  const posterUrl = movie?.posterUrl ?? null;
  const rating = movie?.rating ?? null;

  const watched = movie.watched;        // UI-only rule: rating present => watched
  const isTopPick = watched == true && rating >= 4.5;


  return (
    <div className="bg-bg-surface/95 p-4 rounded-lg text-center text-text-primary hover:ring-3 hover:ring-accent-muted">
        
      <Poster src={posterUrl} alt={`${title} poster`} />


      <h2 className="mt-3 font-semibold truncate">{title}</h2>
      <h3 className="text-sm opacity-80 truncate">{genre}</h3>

     {features.TopPickBadge && <TopPickBadge show={isTopPick} />}

     {watched == false ? (
        <StatusPill watched={false} />
      ) : (
        <div className="mt-2">
          <StarRating value={rating} />
        </div>
      )}
    </div>
  );
}

export default MovieCard;
