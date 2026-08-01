<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE movies MODIFY status ENUM('watchlist', 'watched', 'pending') NOT NULL");
        DB::table('movies')->where('status', 'watchlist')->update(['status' => 'pending']);
        DB::statement("ALTER TABLE movies MODIFY status ENUM('pending', 'watched') NOT NULL");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE movies MODIFY status ENUM('pending', 'watched', 'watchlist') NOT NULL");
        DB::table('movies')->where('status', 'pending')->update(['status' => 'watchlist']);
        DB::statement("ALTER TABLE movies MODIFY status ENUM('watchlist', 'watched') NOT NULL");
    }
};
