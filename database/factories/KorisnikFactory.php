<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Uloga;
use App\Models\Korisnik;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

class KorisnikFactory extends Factory
{
    protected $model = Korisnik::class;

    public function definition()
    {
        return [
            'user_id' => User::factory(),
            'ime' => $this->faker->name,
            'email' => $this->faker->unique()->safeEmail,
            'sifra' => 'password', // Default password for all users
            'uloga_id' => Uloga::inRandomOrder()->first()->id,
        ];
    }
}