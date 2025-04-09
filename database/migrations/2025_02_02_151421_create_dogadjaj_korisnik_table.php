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
        Schema::create('dogadjaj_korisnik', function (Blueprint $table) {
            $table->id();
            $table->foreignId('dogadjaj_id')->constrained('dogadjaji')->onDelete('cascade');
            $table->foreignId('korisnik_id')->constrained('korisnici')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dogadjaj_korisnik');
    }
};
