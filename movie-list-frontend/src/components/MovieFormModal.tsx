import { useEffect, useState, type FormEvent } from "react";
import type { AxiosError } from "axios";
import api from "../lib/axios";
import type { MovieStatus, NewMoviePayload, TmdbSearchResult } from "../types";

interface MovieFormModalProps {
  onClose: () => void;
  onSubmit: (payload: NewMoviePayload) => Promise<void>;
}

interface LaravelErrorResponse {
  message?: string;
}

export default function MovieFormModal({
  onClose,
  onSubmit,
}: MovieFormModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TmdbSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  const [selected, setSelected] = useState<TmdbSearchResult | null>(null);
  const [status, setStatus] = useState<MovieStatus>("pending");
  const [rating, setRating] = useState<number | "">("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSearchError("");
      return;
    }

    const timeout = setTimeout(async () => {
      setSearching(true);
      setSearchError("");
      try {
        const res = await api.get<TmdbSearchResult[]>("/tmdb/search", {
          params: { query: query.trim() },
        });
        setResults(res.data);
      } catch {
        setSearchError("Couldn't search TMDB right now.");
      } finally {
        setSearching(false);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [query]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!selected) {
      setError("Pick a movie from the search results first.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await onSubmit({
        title: selected.title,
        release_year: selected.release_year ?? new Date().getFullYear(),
        status,
        rating: rating === "" ? null : Number(rating),
        notes: notes.trim() || null,
        tmdb_id: selected.tmdb_id,
        poster_path: selected.poster_path,
      });
      onClose();
    } catch (err) {
      const axiosErr = err as AxiosError<LaravelErrorResponse>;
      setError(
        axiosErr.response?.data?.message || "Couldn't save that movie. Try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-th-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-3xl rounded-sm border border-th-border/20 bg-th-header shadow-xl shadow-th-black/50 p-6">
        <h2 className="font-display text-xl text-th-white mb-5">Add a movie</h2>

        {!selected ? (
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm text-th-owhite/80 mb-1.5">
                Search
              </label>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-sm border border-th-border/25 bg-th-black/70 px-4 py-2.5 text-th-white placeholder:text-th-descrip focus:outline-none focus:border-th-accent focus:ring-1 focus:ring-th-accent/30 transition-colors"
                placeholder="Search for a movie…"
                autoFocus
              />
            </div>

            <div className="h-80 overflow-y-auto rounded-sm border border-th-border/10 bg-th-black/70 p-3">
              {searching && (
                <div className="h-full flex items-center justify-center">
                  <p className="text-sm text-th-descrip">Searching…</p>
                </div>
              )}
              {searchError && (
                <div className="h-full flex items-center justify-center">
                  <p className="text-sm text-red-400">{searchError}</p>
                </div>
              )}

              {!searching && !searchError && results.length === 0 && (
                <div className="h-full flex items-center justify-center">
                  <p className="text-sm text-th-descrip">
                    {query.trim() ? "No movies found." : "Start typing to search…"}
                  </p>
                </div>
              )}

              {results.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {results.map((movie) => (
                    <button
                      key={movie.tmdb_id}
                      type="button"
                      onClick={() => setSelected(movie)}
                      className="group/card flex flex-col text-left rounded-sm border border-th-border/15 bg-th-header/60 hover:border-th-accent/40 hover:bg-th-header transition-all overflow-hidden"
                    >
                      <div className="w-full h-36 bg-th-black">
                        {movie.poster_path ? (
                          <img
                            src={movie.poster_path}
                            alt={movie.title}
                            className="w-full h-full object-cover opacity-80 group-hover/card:opacity-100 transition-opacity"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-th-descrip text-xs">
                            No poster
                          </div>
                        )}
                      </div>
                      <div className="p-2.5">
                        <p className="text-sm text-th-white leading-snug line-clamp-2">
                          {movie.title}
                        </p>
                        {movie.release_year && (
                          <p className="text-xs text-th-descrip mt-0.5">
                            {movie.release_year}
                          </p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-sm border border-red-400 text-red-400 hover:bg-red-400 hover:text-th-black transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex items-center gap-4 p-3 rounded-sm border border-th-border/15 bg-th-black/40">
              <div className="w-20 h-28 shrink-0 bg-th-black rounded-sm overflow-hidden border border-th-border/10">
                {selected.poster_path ? (
                  <img
                    src={selected.poster_path}
                    alt={selected.title}
                    className="w-full h-full object-cover"
                  />
                ) : null}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-th-white font-display text-lg leading-snug truncate">
                  {selected.title}
                </p>
                {selected.release_year && (
                  <p className="text-sm text-th-descrip mt-0.5">
                    {selected.release_year}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="text-xs text-th-accent hover:text-th-accent/80 hover:underline mt-2 transition-colors"
                >
                  Change movie
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm text-th-owhite/80 mb-1.5">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as MovieStatus)}
                className="w-full rounded-sm border border-th-border/25 bg-th-black px-4 py-2.5 text-th-white focus:outline-none focus:border-th-accent focus:ring-1 focus:ring-th-accent/30 transition-colors"
              >
                <option value="pending">Pending</option>
                <option value="watched">Watched</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-th-owhite/80 mb-1.5">
                Rating (1–5)
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setRating(rating === n ? "" : n)}
                    className={`w-9 h-9 rounded-sm border text-sm transition-colors ${
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
              <label className="block text-sm text-th-owhite/80 mb-1.5">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Optional notes…"
                className="w-full rounded-sm border border-th-border/25 bg-th-black px-4 py-2.5 text-th-white placeholder:text-th-descrip focus:outline-none focus:border-th-accent focus:ring-1 focus:ring-th-accent/30 transition-colors resize-none"
              />
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 rounded-sm border border-th-accent text-th-accent hover:bg-th-accent hover:text-th-black font-medium transition-colors disabled:opacity-60"
              >
                {submitting ? "Saving…" : "Save movie"}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-sm border border-red-400 text-red-400 hover:bg-red-400 hover:text-th-black transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}