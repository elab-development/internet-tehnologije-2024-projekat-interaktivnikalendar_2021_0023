<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Korisnik;

class KorisnikSeeder extends Seeder
{
    public function run()
    {
        // Kreirajte 5 korisnika
        Korisnik::factory()->count(5)->create();
    }
}
