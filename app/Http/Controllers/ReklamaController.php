<?php

namespace App\Http\Controllers;

use App\Models\Reklama;
use Illuminate\Http\Request;

class ReklamaController extends Controller
{
    public function index()
    {
        return Reklama::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'sadrzaj' => 'required|string',
            'link' => 'required|string|max:255',
            'vidljivo_premium' => 'required|boolean',
        ]);

        $reklama = Reklama::create($validated);

        return response()->json($reklama, 201);
    }

    public function show($id)
    {
        $reklama = Reklama::find($id);
        return $reklama;
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'sadrzaj' => 'sometimes|required|string',
            'link' => 'sometimes|required|string|max:255',
            'vidljivo_premium' => 'sometimes|required|boolean',
        ]);

        $reklama = Reklama::find($id);
        $reklama->update($validated);

        return response()->json($reklama, 200);
    }

    public function destroy($id)
    {
        $reklama = Reklama::find($id);
        $reklama->delete();

        return response()->json(null, 204);
    }
}
