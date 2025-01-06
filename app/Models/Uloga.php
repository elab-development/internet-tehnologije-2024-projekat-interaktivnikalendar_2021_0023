<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Uloga extends Model
{
    use HasFactory;

    protected $table = 'uloge';

    protected $fillable = [
        'naziv',
    ];

    public function korisnici()
    {
        return $this->hasMany(Korisnik::class);
    }
}
