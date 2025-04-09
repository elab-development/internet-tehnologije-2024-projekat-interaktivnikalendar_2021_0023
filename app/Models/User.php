<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory;

    protected $fillable = ['name', 'email', 'password'];

    protected $hidden = ['password', 'remember_token'];

    public function korisnik()
    {
        return $this->hasOne(Korisnik::class);
    }

    public function joinedEvents()
    {   
    return $this->belongsToMany(Dogadjaj::class, 'dogadjaj_korisnik', 'korisnik_id', 'dogadjaj_id');
    }

}