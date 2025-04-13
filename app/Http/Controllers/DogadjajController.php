<?php

namespace App\Http\Controllers;

use App\Models\Dogadjaj;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class DogadjajController extends Controller
{
    public function testKesiranje()
    {
        // Proveravamo da li keš postoji
        if (Cache::has('dogadjaji_test')) {
            $dogadjaji = Cache::get('dogadjaji_test');
            return response()->json(['message' => 'Podaci iz keša', 'data' => $dogadjaji]);
        }

        // Ako ne postoji, keširamo rezultate
        $dogadjaji = Dogadjaj::all(); // Pretpostavka: dohvatamo sve događaje
        Cache::put('dogadjaji_test', $dogadjaji, 60); // Keš traje 60 minuta

        return response()->json(['message' => 'Keširan novi rezultat', 'data' => $dogadjaji]);
    }


    public function index(Request $request)
    {
        $cacheKey = 'dogadjaji_' . md5(json_encode($request->all())); // Jedinstveni ključ za keš

        // Proveravamo da li postoji keširan rezultat
        $dogadjaji = Cache::remember($cacheKey, 60, function () use ($request) {
            $query = Dogadjaj::query();

            if ($request->has('naziv') && $request->input('naziv') !== '') {
                $query->where('naziv', 'like', '%' . $request->input('naziv') . '%');
            }

            if ($request->has('opis') && $request->input('opis') !== '') {
                $query->where('opis', 'like', '%' . $request->input('opis') . '%');
            }

            $perPage = $request->input('per_page', 10);
            return $query->paginate($perPage);
        });

        return response()->json($dogadjaji, 200);
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

        // Brisanje keša
        Cache::forget('dogadjaji_*'); // Očistimo sve ključeve koji počinju sa 'dogadjaji_'


        return response()->json($dogadjaj, 201);
    }

    public function show($id)
    {
        $cacheKey = 'dogadjaj_' . $id; // Jedinstveni ključ za keš

        // Proveravamo da li postoji keširan rezultat
        $dogadjaj = Cache::remember($cacheKey, 60, function () use ($id) {
            return Dogadjaj::findOrFail($id);
        });

        return response()->json($dogadjaj, 200);
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

        Cache::forget('dogadjaj_' . $id);
        Cache::forget('dogadjaji_*'); // Očistimo i listu događaja

        return response()->json($dogadjaj, 200);
    }

    public function destroy($id)
    {
        $dogadjaj = Dogadjaj::findOrFail($id);
        $dogadjaj->delete();

        Cache::forget('dogadjaj_' . $id);
        Cache::forget('dogadjaji_*'); // Očistimo i listu događaja

        return response()->json(null, 204);
    }

    public function pretraga($naziv)
    {
        $cacheKey = 'pretraga_dogadjaji_' . md5($naziv); // Jedinstveni ključ za keš

        // Proveravamo da li postoji keširan rezultat
        $dogadjaji = Cache::remember($cacheKey, 60, function () use ($naziv) {
            return Dogadjaj::where('naziv', 'like', '%' . $naziv . '%')->get();
        });

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

    public function paginateAndFilter(Request $request)
    {
        $query = Dogadjaj::query();

        // Filter za naziv
        if ($request->has('naziv') && $request->input('naziv') !== '') {
            $query->where('naziv', 'like', '%' . $request->input('naziv') . '%');
        }

        // Filter za opis (ako postoji)
        if ($request->has('opis') && $request->input('opis') !== '') {
            $query->where('opis', 'like', '%' . $request->input('opis') . '%');
        }

        $perPage = $request->input('per_page', 10);

        return response()->json($query->paginate($perPage), 200);
    }


}