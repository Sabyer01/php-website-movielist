<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Movie extends Model
{
   protected $fillable = [
    'user_id',
    'title',
    'release_year',
    'status',
    'rating',
    'notes',
    'tmdb_id',
    'poster_path',
];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

}
