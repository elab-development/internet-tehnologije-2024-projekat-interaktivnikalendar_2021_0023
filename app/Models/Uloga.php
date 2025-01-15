<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Uloga extends Model
{

    protected $table = 'uloga';
    protected $fillable = ['naziv'];

    public function korisnici()
    {
        return $this->hasMany(Korisnik::class);
    }
}
