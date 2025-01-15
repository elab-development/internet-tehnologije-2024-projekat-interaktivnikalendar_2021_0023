<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('reklame', function (Blueprint $table) {
            $table->id();
            $table->text('sadrzaj');
            $table->string('link');
            $table->boolean('vidljivo_premium');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('reklame');
    }
};