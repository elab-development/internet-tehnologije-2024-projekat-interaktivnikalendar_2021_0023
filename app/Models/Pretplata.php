<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pretplata extends Model
{
    use HasFactory;

    protected $table = 'pretplate';

    protected $fillable = [
        'korisnik_id', 
        'datum_pocetka', 
        'datum_isteka'
    ];

    public function korisnik()
    {
        return $this->belongsTo(Korisnik::class);
    }

    public function reklame()
    {
        return $this->hasMany(Reklama::class);
    }
}
