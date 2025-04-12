<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\KorisnikController;
use App\Http\Controllers\UlogaController;
use App\Http\Controllers\DogadjajController;
use App\Http\Controllers\PretplataController;
use App\Http\Controllers\ReklamaController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ContactController;

Route::get('test-kes', [DogadjajController::class, 'testKesiranje']);

Route::get('dogadjaji/paginacija', [DogadjajController::class, 'paginateAndFilter'])
    ->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->get('/user-details', [KorisnikController::class, 'getUserDetails']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/contact', [ContactController::class, 'store'])->middleware('auth:sanctum');


Route::get('reklama', [ReklamaController::class, 'getRandomReklama']);

Route::put('dogadjaji/{id}/join', [DogadjajController::class, 'joinEvent'])->middleware('auth:sanctum');
Route::get('dogadjaji/joined', [DogadjajController::class, 'getJoinedEvents'])->middleware('auth:sanctum');
Route::delete('dogadjaji/{id}/leave', [DogadjajController::class, 'leaveEvent'])->middleware('auth:sanctum');
// Rute za Korisnik resurs
//Route::apiResource('korisnici', KorisnikController::class);

// Rute za Uloga resurs
Route::apiResource('uloge', UlogaController::class);

// Rute za Dogadjaj resurs
Route::apiResource('dogadjaji', DogadjajController::class)->middleware('auth:sanctum')->except(['store', 'update', 'destroy']);
Route::post('dogadjaji', [DogadjajController::class, 'store'])->middleware(['auth:sanctum', 'admin']);
Route::put('dogadjaji/{dogadjaj}', [DogadjajController::class, 'update'])->middleware(['auth:sanctum', 'admin']);
Route::delete('dogadjaji/{dogadjaj}', [DogadjajController::class, 'destroy'])->middleware(['auth:sanctum', 'admin']);

// Rute za Pretplata resurs
Route::apiResource('pretplate', PretplataController::class)->middleware('auth:sanctum')->except(['store', 'update', 'destroy']);
Route::post('pretplate', [PretplataController::class, 'store'])->middleware(['auth:sanctum', 'admin']);
Route::put('pretplate/{pretplata}', [PretplataController::class, 'update'])->middleware(['auth:sanctum', 'admin']);
Route::delete('pretplate/{pretplata}', [PretplataController::class, 'destroy'])->middleware(['auth:sanctum', 'admin']);

// Rute za Reklama resurs
Route::apiResource('reklame', ReklamaController::class)->middleware('auth:sanctum')->except(['index']);
Route::get('reklame', [ReklamaController::class, 'index'])->middleware(['auth:sanctum']);

// Rute za pretragu događaja
Route::get('dogadjaji/pretraga/{naziv}', [DogadjajController::class, 'pretraga'])->middleware(['auth:sanctum']);

// Route za registraciju, login i logout
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// Premium user rute (bez reklama)
Route::middleware(['auth:sanctum', 'premium'])->group(function () {
    Route::get('reklame/premium', [ReklamaController::class, 'premiumReklame']);
});