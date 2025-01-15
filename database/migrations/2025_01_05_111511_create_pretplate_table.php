<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('pretplate', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('korisnik_id');
            $table->date('datum_pocetka');
            $table->date('datum_isteka');
            $table->timestamps();

            $table->foreign('korisnik_id')->references('id')->on('korisnici')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('pretplate');
    }
};