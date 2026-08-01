<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Movie;

class MovieController extends Controller
{
    public function index(Request $request)
    {
        $movies = $request->user()->movies;

        return response()->json($movies);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'release_year' => 'required|integer',
            'status' => 'required|in:pending,watched',
            'rating' => 'nullable|integer|min:1|max:5',
            'notes' => 'nullable|string',
            'tmdb_id' => 'nullable|integer',
            'poster_path' => 'nullable|string',
        ]);

        $movie = $request->user()->movies()->create($validated);

        return response()->json($movie, 201);
    }

    public function show(Request $request, string $id)
    {
        $movie = $request->user()
                         ->movies()
                         ->findOrFail($id);

        return response()->json($movie);
    }

    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'release_year' => 'required|integer',
            'status' => 'required|in:pending,watched',
            'rating' => 'nullable|integer|min:1|max:5',
            'notes' => 'nullable|string',
            'tmdb_id' => 'nullable|integer',
            'poster_path' => 'nullable|string',
        ]);

        $movie = $request->user()
                         ->movies()
                         ->findOrFail($id);

        $movie->update($validated);

        return response()->json($movie);
    }

    public function destroy(Request $request, string $id)
    {
        $movie = $request->user()
                         ->movies()
                         ->findOrFail($id);

        $movie->delete();

        return response()->json([
            'message' => 'Movie deleted successfully.'
        ]);
    }
}