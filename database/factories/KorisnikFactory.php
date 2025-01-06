<?php

namespace Database\Factories;

use App\Models\Korisnik;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

class KorisnikFactory extends Factory
{
    protected $model = Korisnik::class;

    public function definition()
    {
        return [
            'ime' => $this->faker->name,
            'email' => $this->faker->unique()->safeEmail,
            'sifra' => Hash::make('password'), // defaultna lozinka za sve korisnike
            'uloga_id' => 1, // ili generišite nasumično ako imate više uloga
        ];
    }
}