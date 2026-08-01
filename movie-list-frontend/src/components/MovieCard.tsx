import type { Movie, MovieStatus } from "../types";

const STATUS_STYLES: Record<MovieStatus, string> = {
  pending: "bg-th-black/80 text-th-owhite border-th-owhite",
  watched: "bg-th-black/80 text-th-accent border-th-accent/40",
};

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
      <path d="M4.5 12.5l5 5 10-11" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface MovieCardProps {
  movie: Movie;
  onToggleStatus: (movie: Movie) => void;
  onDelete: (movie: Movie) => void;
}

export default function MovieCard({
  movie,
  onToggleStatus,
  onDelete,
}: MovieCardProps) {
  const isWatched = movie.status === "watched";

  return (
    <div className="group rounded-sm border border-th-border/15 bg-th-header/50 overflow-hidden flex flex-col hover:border-th-border/30 transition-colors">
      {/* Poster */}
      <div className="relative h-92 bg-th-black">
        {movie.poster_path ? (
          <img
            src={movie.poster_path}
            alt={movie.title}
            className="w-full h-full object-cover opacity-55 group-hover:opacity-100 transition-opacity duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-th-header to-th-black">
            <span className="text-th-descrip text-sm px-4 text-center">
              No poster
            </span>
          </div>
        )}

        {/* Status badge */}
        <span
          className={`absolute top-2 right-2 flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-sm border backdrop-blur-sm ${STATUS_STYLES[movie.status]}`}
        >
          {isWatched ? <CheckIcon /> : <ClockIcon />}
          {isWatched ? "Watched" : "Pending"}
        </span>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-3 flex-1 bg-th-black">
        <div>
          <h3 className="font-display text-lg text-th-white leading-snug">
            {movie.title}
          </h3>
          {movie.release_year && (
            <p className="text-sm text-th-owhite/70 mt-0.5">{movie.release_year}</p>
          )}
        </div>

        <div className="mt-auto flex items-center gap-2 pt-1">
          <button
            onClick={() => onToggleStatus(movie)}
            className={`text-sm px-3 py-1.5 rounded-sm border transition-colors duration-300 ${
              isWatched
                ? "border-th-owhite text-th-owhite hover:bg-th-owhite hover:text-th-black"
                : "border-th-accent text-th-accent hover:bg-th-accent hover:text-th-black"
            }`}
          >
            Mark as {isWatched ? "Pending" : "Watched"}
          </button>
          <button
            onClick={() => onDelete(movie)}
            className="text-sm px-3 py-1.5 rounded-sm border border-red-400 text-red-400 hover:bg-red-400 hover:text-th-black transition-colors duration-300"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}