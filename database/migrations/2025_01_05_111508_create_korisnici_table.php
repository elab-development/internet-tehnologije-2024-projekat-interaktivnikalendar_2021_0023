<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('korisnici', function (Blueprint $table) {
            $table->id();
            $table->string('ime');
            $table->string('email')->unique();
            $table->string('sifra');
            $table->foreignId('uloga_id')->constrained('uloge');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('korisnici');
    }
};
