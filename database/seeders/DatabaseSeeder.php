<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Pozovite UlogaSeeder
        $this->call(UlogaSeeder::class);

        // Pozovite KorisnikSeeder nakon UlogaSeeder
        $this->call(KorisnikSeeder::class);

        // Pozovite DogadjajSeeder nakon KorisnikSeeder
        $this->call(DogadjajSeeder::class);

        // Pozovite ReklamaSeeder
        $this->call(ReklamaSeeder::class);

        // Pozovite PretplataSeeder
        $this->call(PretplataSeeder::class);
    }
}
