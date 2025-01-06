<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Dogadjaj;

class DogadjajSeeder extends Seeder
{
    public function run()
    {
        // Kreirajte 5 događaja
        Dogadjaj::factory()->count(5)->create();
    }
}
