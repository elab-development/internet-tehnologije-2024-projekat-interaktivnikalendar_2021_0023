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
        ]);

        // Postavljanje korisnik_id na 1
        $validated['korisnik_id'] = 1;

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

    public function joinEvent($id)
    {
        try {
            $korisnik = auth()->user();
            $dogadjaj = Dogadjaj::findOrFail($id);
            $dogadjaj->participants()->attach($korisnik->id);

            return response()->json(['message' => 'Pridruženi događaju', 'dogadjaj' => $dogadjaj]);
        } catch (\Exception $e) {
            \Log::error('Error joining event: ' . $e->getMessage());

            return response()->json(['message' => 'Došlo je do greške prilikom pridruživanja događaju'], 500);
        }
    }

    public function getJoinedEvents()
    {
        $korisnik = auth()->user();

        if (!$korisnik) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        return response()->json($korisnik->joinedEvents()->get()); // Dodato ->get()
    }

    public function leaveEvent($id)
    {
        try {
            $korisnik = auth()->user();
            $dogadjaj = Dogadjaj::findOrFail($id);

            // Proveri da li je korisnik pridružen događaju
            if (!$dogadjaj->participants()->where('korisnik_id', $korisnik->id)->exists()) {
                return response()->json(['message' => 'Niste pridruženi ovom događaju'], 400);
            }

            $dogadjaj->participants()->detach($korisnik->id);

            return response()->json(['message' => 'Uspešno otkazan događaj']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Greška pri otkazivanju događaja'], 500);
        }
    }


}