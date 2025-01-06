<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\KorisnikController;
use App\Http\Controllers\UlogaController;
use App\Http\Controllers\DogadjajController;
use App\Http\Controllers\PretplataController;
use App\Http\Controllers\ReklamaController;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Rute za Korisnik resurs
Route::apiResource('korisnici', KorisnikController::class);

// Rute za Uloga resurs
Route::apiResource('uloge', UlogaController::class);

// Rute za Dogadjaj resurs
Route::apiResource('dogadjaji', DogadjajController::class);

// Rute za Pretplata resurs
Route::apiResource('pretplate', PretplataController::class);

// Rute za Reklama resurs
Route::apiResource('reklame', ReklamaController::class);