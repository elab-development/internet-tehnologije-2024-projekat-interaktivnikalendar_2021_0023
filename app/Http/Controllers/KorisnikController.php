<?php

namespace App\Http\Controllers;

use App\Models\Korisnik;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class KorisnikController extends Controller
{
    public function index()
    {
        return Korisnik::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'ime' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:korisnici',
            'sifra' => 'required|string|min:8',
            'uloga_id' => 'required|exists:uloge,id',
        ]);

        $validated['sifra'] = Hash::make($validated['sifra']);

        $korisnik = Korisnik::create($validated);

        return response()->json($korisnik, 201);
    }

    public function show($id)
    {
        $korisnik = Korisnik::findOrFail($id);
        return $korisnik;
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'ime' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:korisnici,email,'.$id,
            'sifra' => 'sometimes|required|string|min:8',
            'uloga_id' => 'sometimes|required|exists:uloge,id',
        ]);

        if (isset($validated['sifra'])) {
            $validated['sifra'] = Hash::make($validated['sifra']);
        }

        $korisnik = Korisnik::findOrFail($id);
        $korisnik->update($validated);

        return response()->json($korisnik, 200);
    }

    public function destroy($id)
    {
        $korisnik = Korisnik::findOrFail($id);
        $korisnik->delete();

        return response()->json(null, 204);
    }
}
