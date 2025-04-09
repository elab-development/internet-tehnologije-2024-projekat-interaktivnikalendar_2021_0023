<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Dogadjaj extends Model
{
    use HasFactory;
    protected $table = "dogadjaji";
    protected $fillable = ['naziv', 'opis', 'datum_pocetka', 'datum_zavrsetka', 'korisnik_id'];

    public function korisnik()
    {
        return $this->belongsTo(Korisnik::class);
    }

    public function participants()
{
    return $this->belongsToMany(Korisnik::class, 'dogadjaj_korisnik', 'dogadjaj_id', 'korisnik_id');
}
}