<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Pretplata;

class PretplataSeeder extends Seeder
{
    public function run()
    {
        // Kreirajte 5 pretplata
        Pretplata::factory()->count(5)->create();
    }
}