<?php

namespace Database\Factories;

use App\Models\Uloga;
use Illuminate\Database\Eloquent\Factories\Factory;

class UlogaFactory extends Factory
{
    protected $model = Uloga::class;

    public function definition()
    {
        return [
            'naziv' => $this->faker->word,
        ];
    }
}