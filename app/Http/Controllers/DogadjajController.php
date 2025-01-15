<?php

namespace App\Http\Controllers;

use App\Models\Dogadjaj;
use Illuminate\Http\Request;

class DogadjajController extends Controller
{
    public function index()
    {
        return Dogadjaj::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'naziv' => 'required|string|max:255',
            'opis' => 'required|string',
            'datum_pocetka' => 'required|date',
            'datum_zavrsetka' => 'required|date',
            'korisnik_id' => 'required|exists:korisnici,id',
        ]);

        $dogadjaj = Dogadjaj::create($validated);

        return response()->json($dogadjaj, 201);
    }

    public function show($id)
    {
        $dogadjaj = Dogadjaj::findOrFail($id);
        return $dogadjaj;
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'naziv' => 'sometimes|required|string|max:255',
            'opis' => 'sometimes|required|string',
            'datum_pocetka' => 'sometimes|required|date',
            'datum_zavrsetka' => 'sometimes|required|date',
            'korisnik_id' => 'sometimes|required|exists:korisnici,id',
        ]);

        $dogadjaj = Dogadjaj::findOrFail($id);
        $dogadjaj->update($validated);

        return response()->json($dogadjaj, 200);
    }

    public function destroy($id)
    {
        $dogadjaj = Dogadjaj::findOrFail($id);
        $dogadjaj->delete();

        return response()->json(null, 204);
    }

    public function pretraga($naziv)
    {
        $dogadjaji = Dogadjaj::where('naziv', 'like', '%' . $naziv . '%')->get();
        return response()->json($dogadjaji, 200);
    }
}
