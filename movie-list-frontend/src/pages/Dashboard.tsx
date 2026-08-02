import { useEffect, useState } from "react";
import api from "../lib/axios";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";
import MovieFormModal from "../components/MovieFormModal";
import EditCardModal from "../components/EditCardModal";
import type { Movie, NewMoviePayload } from "../types";

type Filter = "all" | "watched" | "pending";

export default function Dashboard() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    fetchMovies();
  }, []);

  async function fetchMovies() {
    setLoading(true);
    setError("");
    try {
      const res = await api.get<Movie[]>("/movies");
      setMovies(res.data);
    } catch {
      setError("Couldn't load your movies. Try refreshing.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddMovie(payload: NewMoviePayload) {
    const res = await api.post<Movie>("/movies", payload);
    setMovies((prev) => [res.data, ...prev]);
  }

  async function handleToggleStatus(movie: Movie) {
    const newStatus = movie.status === "watched" ? "pending" : "watched";
    setMovies((prev) =>
      prev.map((m) => (m.id === movie.id ? { ...m, status: newStatus } : m))
    );
    try {
      await api.put(`/movies/${movie.id}`, {
        title: movie.title,
        release_year: movie.release_year,
        status: newStatus,
        rating: movie.rating ?? null,
        notes: movie.notes ?? null,
        tmdb_id: movie.tmdb_id,
        poster_path: movie.poster_path,
      });
    } catch {
      setMovies((prev) =>
        prev.map((m) => (m.id === movie.id ? { ...m, status: movie.status } : m))
      );
      setError("Couldn't update that movie's status.");
    }
  }

  async function handleDelete(movie: Movie) {
    const prevMovies = movies;
    setMovies((prev) => prev.filter((m) => m.id !== movie.id));
    try {
      await api.delete(`/movies/${movie.id}`);
    } catch {
      setMovies(prevMovies);
      setError("Couldn't remove that movie.");
    }
  }

  async function handleEditMovie(
    id: number,
    payload: {
      title: string;
      release_year: number;
      status: Movie["status"];
      rating: number | null;
      notes: string | null;
      tmdb_id: number;
      poster_path: string | null;
    }
  ) {
    const res = await api.put<Movie>(`/movies/${id}`, payload);
    setMovies((prev) => prev.map((m) => (m.id === id ? res.data : m)));
  }

  const filteredMovies = movies.filter((m) =>
    filter === "all" ? true : m.status === filter
  );

  return (
    <div className="min-h-screen bg-th-black">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <div className="flex gap-2">
            {(["all", "pending", "watched"] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-sm text-sm border transition-colors capitalize ${
                  filter === f
                    ? "bg-th-accent text-th-black border-th-accent"
                    : "border-th-border/30 text-th-owhite/80 hover:text-th-white hover:border-th-border/50"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-sm bg-th-accent text-th-black font-medium hover:brightness-110 transition-all"
          >
            + Add movie
          </button>
        </div>

        {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

        {loading ? (
          <p className="text-th-descrip">Loading your list…</p>
        ) : filteredMovies.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-th-border/30 rounded-sm">
            <p className="text-th-descrip">
              {movies.length === 0
                ? "Your list is empty. Add your first movie."
                : "Nothing here yet."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDelete}
                onEdit={setEditingMovie}
              />
            ))}
          </div>
        )}
      </main>

      {showModal && (
        <MovieFormModal
          onClose={() => setShowModal(false)}
          onSubmit={handleAddMovie}
        />
      )}

      {editingMovie && (
        <EditCardModal
          movie={editingMovie}
          onClose={() => setEditingMovie(null)}
          onSubmit={handleEditMovie}
        />
      )}
    </div>
  );
}