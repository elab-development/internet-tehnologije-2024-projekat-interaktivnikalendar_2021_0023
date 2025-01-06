<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Model;

class Korisnik extends Authenticatable
{
    use HasFactory;

    protected $table = 'korisnici';

    protected $fillable = [
        'ime', 
        'email', 
        'sifra', 
        'uloga_id'
    ];

    protected $hidden = [
        'sifra',
    ];

    public function uloga()
    {
        return $this->belongsTo(Uloga::class);
    }

    public function dogadjaji()
    {
        return $this->hasMany(Dogadjaj::class);
    }

    public function pretplate()
    {
        return $this->hasMany(Pretplata::class);
    }
}
