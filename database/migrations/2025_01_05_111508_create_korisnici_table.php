<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('korisnici', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('ime');
            $table->string('email')->unique();
            $table->string('sifra');
            $table->unsignedBigInteger('uloga_id');
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('uloga_id')->references('id')->on('uloga')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('korisnici');
    }
};