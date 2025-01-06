<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Uloga;

class UlogaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Uloga::create(['naziv' => 'Admin']);
        Uloga::create(['naziv' => 'User']);
        Uloga::create(['naziv' => 'Moderator']);
    }
}
