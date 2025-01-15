<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Korisnik extends Model
{
    use HasFactory;
    protected $table = 'korisnici';
    protected $fillable = ['user_id', 'ime', 'email', 'sifra', 'uloga_id'];

    protected $hidden = ['sifra'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

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

    public function setSifraAttribute($value)
    {
        $this->attributes['sifra'] = bcrypt($value);
    }
}