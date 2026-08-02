import { useState } from "react";
import type { Movie, MovieStatus } from "../types";

interface EditCardModalProps {
  movie: Movie;
  onClose: () => void;
  onSubmit: (
    id: number,
    payload: {
      title: string;
      release_year: number;
      status: MovieStatus;
      rating: number | null;
      notes: string | null;
      tmdb_id: number;
      poster_path: string | null;
    }
  ) => Promise<void>;
}

export default function EditCardModal({ movie, onClose, onSubmit }: EditCardModalProps) {
  const [status, setStatus] = useState<MovieStatus>(movie.status);
  const [rating, setRating] = useState<number | "">(movie.rating ?? "");
  const [notes, setNotes] = useState(movie.notes ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      await onSubmit(movie.id, {
        title: movie.title,
        release_year: movie.release_year,
        status,
        rating: rating === "" ? null : Number(rating),
        notes: notes.trim() || null,
        tmdb_id: movie.tmdb_id ?? 0,
        poster_path: movie.poster_path ?? null,
      });
      onClose();
    } catch {
      setError("Couldn't save changes. Try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-th-black/50 backdrop-blur-sm">
    <div className="w-full max-w-md rounded-sm border border-th-border/30 bg-th-header shadow-xl shadow-th-black/50 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b border-th-border/20">
          <h2 className="font-display text-lg text-th-white">Edit movie</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-5 flex flex-col gap-4">
          {error && <p className="text-sm text-red-400">{error}</p>}

          {/* Read-only title + year */}
          <div className="rounded-sm border border-th-border/15 bg-th-black/40 px-3 py-3">
            <p className="font-display text-th-white leading-snug">{movie.title}</p>
            {movie.release_year != null && (
              <p className="text-sm text-th-owhite/70 mt-0.5">{movie.release_year}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-th-owhite/80 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as MovieStatus)}
              className="w-full px-2 py-2.5 rounded-sm bg-th-black border border-th-border/30 text-th-white focus:outline-none focus:border-th-accent"
            >
              <option value="pending">Pending</option>
              <option value="watched">Watched</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-th-owhite/80 mb-1">Rating (1–5)</label>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(rating === n ? "" : n)}
                  className={`w-10 h-10 sm:w-9 sm:h-9 rounded-sm border text-sm transition-colors ${
                    rating === n
                      ? "bg-th-accent text-th-black border-th-accent"
                      : "border-th-border/40 text-th-owhite hover:border-th-accent/60"
                  }`}
                >
                  {n}
                </button>
              ))}
              {rating !== "" && (
                <button
                  type="button"
                  onClick={() => setRating("")}
                  className="text-xs text-th-owhite/60 hover:text-th-owhite self-center ml-1"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm text-th-owhite/80 mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Optional notes…"
              className="w-full px-3 py-2.5 rounded-sm bg-th-black border border-th-border/30 text-th-white placeholder:text-th-descrip focus:outline-none focus:border-th-accent resize-none"
            />
          </div>

          {/* Buttons – stack full-width on mobile, side-by-side on sm+ */}
          <div className="flex flex-col-reverse sm:flex-row gap-2 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:flex-1 px-4 py-2.5 sm:py-2 rounded-sm bg-th-accent text-th-black font-medium hover:brightness-110 disabled:opacity-60 transition-all"
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
            
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:flex-1 px-4 py-2.5 sm:py-2 rounded-sm border border-red-400 text-red-400 hover:bg-red-400 hover:text-th-black transition-colors duration-300"
            >
              Cancel
            </button>

            
          </div>
        </form>
      </div>
    </div>
  );
}