<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class TmdbController extends Controller
{
    public function search(Request $request)
    {
        $validated = $request->validate([
            'query' => 'required|string|min:1',
        ]);

        $response = Http::withToken(config('services.tmdb.token'))
            ->get('https://api.themoviedb.org/3/search/movie', [
                'query' => $validated['query'],
                'include_adult' => false,
            ]);

        if ($response->failed()) {
            return response()->json(['message' => 'TMDB request failed.'], 502);
        }

        $results = collect($response->json('results'))
            ->map(fn ($movie) => [
                'tmdb_id' => $movie['id'],
                'title' => $movie['title'],
                'release_year' => $movie['release_date']
                    ? (int) substr($movie['release_date'], 0, 4)
                    : null,
                'poster_path' => $movie['poster_path']
                    ? 'https://image.tmdb.org/t/p/w500' . $movie['poster_path']
                    : null,
            ])
            ->values();

        return response()->json($results);
    }
}