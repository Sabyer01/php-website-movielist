<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('movies', function (Blueprint $table) {
            if (!Schema::hasColumn('movies', 'tmdb_id')) {
                $table->unsignedInteger('tmdb_id')->nullable();
            }
            if (!Schema::hasColumn('movies', 'poster_path')) {
                $table->string('poster_path')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('movies', function (Blueprint $table) {
            $table->dropColumn(['tmdb_id', 'poster_path']);
        });
    }
};
