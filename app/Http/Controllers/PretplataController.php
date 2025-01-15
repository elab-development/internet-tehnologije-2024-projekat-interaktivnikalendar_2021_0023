<?php

namespace App\Http\Controllers;

use App\Models\Pretplata;
use Illuminate\Http\Request;

class PretplataController extends Controller
{
    public function index()
    {
        return Pretplata::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'korisnik_id' => 'required|exists:korisnici,id',
            'datum_pocetka' => 'required|date',
            'datum_isteka' => 'required|date',
        ]);

        $pretplata = Pretplata::create($validated);

        return response()->json($pretplata, 201);
    }

    public function show($id)
    {
        $pretplata = Pretplata::find($id);
        return $pretplata;
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'korisnik_id' => 'sometimes|required|exists:korisnici,id',
            'datum_pocetka' => 'sometimes|required|date',
            'datum_isteka' => 'sometimes|required|date',
        ]);

        $pretplata = Pretplata::find($id);
        $pretplata->update($validated);

        return response()->json($pretplata, 200);
    }

    public function destroy($id)
    {
        $pretplata = Pretplata::find($id);
        $pretplata->delete();

        return response()->json(null, 204);
    }

    public function kreiraj(Request $request)
    {
        $validated = $request->validate([
            'korisnik_id' => 'required|exists:korisnici,id',
            'datum_pocetka' => 'required|date',
            'datum_isteka' => 'required|date',
        ]);

        $pretplata = Pretplata::create($validated);

        return response()->json($pretplata, 201);
    }
}
