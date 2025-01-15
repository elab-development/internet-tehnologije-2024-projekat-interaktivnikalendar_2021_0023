<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\KorisnikController;
use App\Http\Controllers\UlogaController;
use App\Http\Controllers\DogadjajController;
use App\Http\Controllers\PretplataController;
use App\Http\Controllers\ReklamaController;
use App\Http\Controllers\AuthController;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Rute za Korisnik resurs
//Route::apiResource('korisnici', KorisnikController::class);

//Rute za Uloga resurs
Route::apiResource('uloge', UlogaController::class);

// Rute za Dogadjaj resurs
//Route::apiResource('dogadjaji', DogadjajController::class);

// Rute za Pretplata resurs
//Route::apiResource('pretplate', PretplataController::class);

// Rute za Reklama resurs
//Route::apiResource('reklame', ReklamaController::class);

//Route::get('dogadjaji/pretraga/{naziv}', [DogadjajController::class, 'pretraga']);

//Route::post('pretplate/kreiraj', [PretplataController::class, 'kreiraj']);

//Route::delete('reklame/obrisi/{id}', [ReklamaController::class, 'obrisi']);

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// Administrator rute (manipulacija bazom)
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::post('dogadjaji', [DogadjajController::class, 'store']);
    Route::put('dogadjaji/{dogadjaj}', [DogadjajController::class, 'update']);
    Route::delete('dogadjaji/{dogadjaj}', [DogadjajController::class, 'destroy']);
    Route::post('pretplate', [PretplataController::class, 'store']);
    Route::put('pretplate/{pretplata}', [PretplataController::class, 'update']);
    Route::delete('pretplate/{pretplata}', [PretplataController::class, 'destroy']);
});

// Premium user rute (bez reklama)
Route::middleware(['auth:sanctum', 'premium'])->group(function () {
    Route::get('reklame/premium', [ReklamaController::class, 'premiumReklame']);
});

// Obični korisnik rute (sa reklamama)
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('reklame', [ReklamaController::class, 'index']);
});