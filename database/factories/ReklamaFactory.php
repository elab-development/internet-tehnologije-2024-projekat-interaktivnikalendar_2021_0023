<?php

namespace Database\Factories;

use App\Models\Reklama;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReklamaFactory extends Factory
{
    protected $model = Reklama::class;

    public function definition()
    {
        return [
            'sadrzaj' => $this->faker->paragraph,
            'link' => $this->faker->url,
            'vidljivo_premium' => $this->faker->boolean,
        ];
    }
}
