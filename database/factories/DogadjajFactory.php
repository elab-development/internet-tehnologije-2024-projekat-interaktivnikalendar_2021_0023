<?php

namespace Database\Factories;

use App\Models\Dogadjaj;
use App\Models\Korisnik;
use Illuminate\Database\Eloquent\Factories\Factory;

class DogadjajFactory extends Factory
{
    protected $model = Dogadjaj::class;

    public function definition()
    {
        return [
            'naziv' => $this->faker->sentence,
            'opis' => $this->faker->paragraph,
            'datum_pocetka' => $this->faker->dateTimeBetween('-1 month', '+1 month'),
            'datum_zavrsetka' => $this->faker->dateTimeBetween('+1 month', '+2 months'),
            'korisnik_id' => Korisnik::factory(),
        ];
    }
}