<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Korisnik;
use App\Models\Uloga;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        

        // Kreiranje dodatnih korisnika
        User::factory(5)->create()->each(function ($user) {
            Korisnik::factory()->create(['user_id' => $user->id]);
        });
    }
}
