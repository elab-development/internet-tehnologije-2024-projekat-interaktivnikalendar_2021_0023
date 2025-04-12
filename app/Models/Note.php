<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Note extends Model
{
    use HasFactory;

    // Tabla povezana sa ovim modelom
    protected $table = 'notes';

    // Polja koja su dozvoljena za masovno popunjavanje
    protected $fillable = [
        'dogadjaj_id',
        'notes_path',
    ];

    // Veza sa modelom Dogadjaj
    public function dogadjaj()
    {
        return $this->belongsTo(Dogadjaj::class, 'dogadjaj_id');
    }
}