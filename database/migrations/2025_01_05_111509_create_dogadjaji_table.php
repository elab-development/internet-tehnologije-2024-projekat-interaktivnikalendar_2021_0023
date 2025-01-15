<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('dogadjaji', function (Blueprint $table) {
            $table->id();
            $table->string('naziv');
            $table->text('opis');
            $table->dateTime('datum_pocetka');
            $table->dateTime('datum_zavrsetka');
            $table->unsignedBigInteger('korisnik_id');
            $table->timestamps();

            $table->foreign('korisnik_id')->references('id')->on('korisnici')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('dogadjaji');
    }
};