<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDogadjajKorisnikTable extends Migration
{
    public function up()
    {
        Schema::create('dogadjaj_korisnik', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('dogadjaj_id');
            $table->unsignedBigInteger('korisnik_id');
            $table->timestamps();

            $table->foreign('dogadjaj_id')->references('id')->on('dogadjaji')->onDelete('cascade');
            $table->foreign('korisnik_id')->references('id')->on('korisnici')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('dogadjaj_korisnik');
    }
}