<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Reklama;

class ReklamaSeeder extends Seeder
{
    public function run()
    {
        // Kreirajte 5 reklama
        Reklama::factory()->count(5)->create();
    }
}
