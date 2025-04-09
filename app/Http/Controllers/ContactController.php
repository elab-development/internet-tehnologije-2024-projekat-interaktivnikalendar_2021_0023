<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ContactMessage; // Model za poruke

class ContactController extends Controller
{
    public function store(Request $request)
    {
        $korisnik = auth()->user()->korisnik; // Dohvatamo korisnika iz baze

    if (!$korisnik || ($korisnik->uloga->naziv !== 'Admin' && $korisnik->uloga->naziv !== 'Premium')) {
        return response()->json(['message' => 'Nemate dozvolu za slanje poruka'], 403);
    }

    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|string|email|max:255',
        'message' => 'required|string|max:1000',
    ]);

    ContactMessage::create($validated);

    return response()->json(['message' => 'Poruka uspešno poslata!'], 201);    
    }
}
