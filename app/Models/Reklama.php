<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reklama extends Model
{
    use HasFactory;

    protected $table = 'reklame';

    protected $fillable = [
        'sadrzaj', 
        'link', 
        'vidljivo_premium'
    ];

    public function pretplate()
    {
        return $this->belongsToMany(Pretplata::class);
    }
}
