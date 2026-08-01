<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
       Schema::create('movies', function (Blueprint $table) {
    $table->id();

    $table->foreignId('user_id')->constrained()->onDelete('cascade');

    $table->string('title');
    $table->integer('release_year');
    $table->enum('status', ['watchlist', 'watched']);
    $table->integer('rating')->nullable();
    $table->text('notes')->nullable();
    $table->unsignedInteger('tmdb_id')->nullable();
    $table->string('poster_path')->nullable();

    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('movies');
    }
};
