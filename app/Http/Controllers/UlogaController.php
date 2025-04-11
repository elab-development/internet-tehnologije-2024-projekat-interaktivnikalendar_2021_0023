<?php

namespace App\Http\Controllers;

use App\Models\Uloga;
use Illuminate\Http\Request;

class UlogaController extends Controller
{
    public function index()
    {
        return Uloga::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'naziv' => 'required|string|max:255',
        ]);

        $uloga = Uloga::create($validated);

        return response()->json($uloga, 201);
    }

    public function show($id)
    {
        $uloga = Uloga::findOrFail($id);
        return $uloga;
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'naziv' => 'sometimes|required|string|max:255',
        ]);

        $uloga = Uloga::findOrFail($id);
        $uloga->update($validated);

        return response()->json($uloga, 200);
    }

    public function destroy($id)
    {
        $uloga = Uloga::findOrFail($id);
        $uloga->delete();

        return response()->json(null, 203);
    }
}