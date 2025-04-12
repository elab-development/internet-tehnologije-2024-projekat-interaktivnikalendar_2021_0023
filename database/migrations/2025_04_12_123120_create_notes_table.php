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
        Schema::create('notes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('dogadjaj_id'); // ID pridruženog događaja
            $table->string('notes_path'); // Putanja beleške na serveru
            $table->timestamps();

            // Dodavanje stranog ključa
            $table->foreign('dogadjaj_id')->references('id')->on('dogadjaji')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notes');
    }
};