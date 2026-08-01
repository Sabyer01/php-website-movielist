export type MovieStatus = "pending" | "watched";

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Movie {
  id: number;
  title: string;
  release_year: number;
  status: MovieStatus;
  rating?: number | null;
  notes?: string | null;
  tmdb_id?: number | null;
  poster_path?: string | null;
}

export interface NewMoviePayload {
  title: string;
  release_year: number;
  status: MovieStatus;
  tmdb_id?: number | null;
  poster_path?: string | null;
}

export interface TmdbSearchResult {
  tmdb_id: number;
  title: string;
  release_year: number | null;
  poster_path: string | null;
}