// MovieCard.tsx
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

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`w-3.5 h-3.5 ${filled ? "text-th-accent fill-th-accent" : "text-th-owhite/30 fill-none"}`}
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

interface MovieCardProps {
  movie: Movie;
  onToggleStatus: (movie: Movie) => void;
  onDelete: (movie: Movie) => void;
  onEdit: (movie: Movie) => void;
}

export default function MovieCard({
  movie,
  onToggleStatus,
  onDelete,
  onEdit,
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

        {/* Rating */}
        {movie.rating != null && (
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <StarIcon key={n} filled={n <= movie.rating!} />
            ))}
            <span className="ml-1.5 text-xs text-th-owhite/60">{movie.rating}/5</span>
          </div>
        )}

        {/* Notes */}
        {movie.notes && (
          <p className="text-sm text-th-owhite/70 line-clamp-2 leading-relaxed">
            {movie.notes}
          </p>
        )}

        {/* Actions – stack on mobile, row on sm+ */}
        <div className="mt-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-1">
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <button
              onClick={() => onToggleStatus(movie)}
              className={`w-full sm:w-auto text-sm px-3 py-2 sm:py-1.5 rounded-sm border transition-colors duration-300 ${
                isWatched
                  ? "border-th-owhite text-th-owhite hover:bg-th-owhite hover:text-th-black"
                  : "border-th-accent text-th-accent hover:bg-th-accent hover:text-th-black"
              }`}
            >
              Mark as {isWatched ? "Pending" : "Watched"}
            </button>

            <button
              onClick={() => onDelete(movie)}
              className="w-full sm:w-auto text-sm px-3 py-2 sm:py-1.5 rounded-sm border border-red-400 text-red-400 hover:bg-red-400 hover:text-th-black transition-colors duration-300"
            >
              Remove
            </button>
          </div>

          <button
            onClick={() => onEdit(movie)}
            className="w-full sm:w-auto text-sm px-3 py-2 sm:py-1.5 rounded-sm border border-th-border/50 text-th-owhite hover:border-th-accent hover:text-th-black hover:bg-th-accent transition-colors duration-300"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}