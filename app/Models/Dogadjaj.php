<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Dogadjaj extends Model
{
    use HasFactory;

    protected $table = 'dogadjaji';

    protected $fillable = [
        'naziv', 
        'opis', 
        'datum_pocetka', 
        'datum_zavrsetka', 
        'korisnik_id'
    ];

    public function korisnik()
    {
        return $this->belongsTo(Korisnik::class);
    }
}
