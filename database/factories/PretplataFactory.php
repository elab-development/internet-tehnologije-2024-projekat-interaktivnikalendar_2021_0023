<?php

namespace Database\Factories;

use App\Models\Pretplata;
use App\Models\Korisnik;
use Illuminate\Database\Eloquent\Factories\Factory;

class PretplataFactory extends Factory
{
    protected $model = Pretplata::class;

    public function definition()
    {
        return [
            'korisnik_id' => Korisnik::factory(),
            'datum_pocetka' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'datum_isteka' => $this->faker->dateTimeBetween('now', '+1 year'),
        ];
    }
}