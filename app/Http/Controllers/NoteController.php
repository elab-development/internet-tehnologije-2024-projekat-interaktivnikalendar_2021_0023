<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Note;
use App\Models\Dogadjaj;
use Illuminate\Support\Facades\Storage;

class NoteController extends Controller
{
    /**
     * Upload beleške za određeni događaj.
     */
    public function upload(Request $request)
    {
        // Validacija ulaznih podataka
        $request->validate([
            'dogadjaj_id' => 'required|exists:dogadjaji,id', // Proverava da li dogadjaj postoji
            'note_file' => 'required|file|mimes:txt|max:2048', // Dozvoljeni fajlovi: .txt, maksimalna veličina 2MB
        ]);

        $dogadjajId = $request->input('dogadjaj_id');
        $file = $request->file('note_file');

        // Generisanje putanje za fajl
        $filePath = $file->storeAs('uploads/notes', "dogadjaj_{$dogadjajId}_" . $file->getClientOriginalName());

        // Kreiranje beleške u bazi
        $note = Note::create([
            'dogadjaj_id' => $dogadjajId,
            'notes_path' => $filePath,
        ]);

        return response()->json([
            'message' => 'Beleška uspešno uploadovana.',
            'note' => $note,
        ], 201);
    }

    public function show($dogadjaj_id)
    {
    $note = Note::where('dogadjaj_id', $dogadjaj_id)->first();

    if (!$note || !Storage::exists($note->notes_path)) {
        return response()->json(['message' => 'Beleška nije pronađena.'], 404);
    }

    $content = Storage::get($note->notes_path);
    $url = url('storage/' . $note->notes_path);

    return response()->json([
        'note_content' => $content,
        'note_url' => $url,
        'message' => 'Beleška učitana.',
    ], 200);
    }

    public function destroy($dogadjaj_id)
    {
    $note = Note::where('dogadjaj_id', $dogadjaj_id)->first();

    if (!$note) {
        return response()->json(['message' => 'Beleška ne postoji.'], 404);
    }

    if (Storage::exists($note->notes_path)) {
        Storage::delete($note->notes_path);
    }

    $note->delete();

    return response()->json(['message' => 'Beleška je uspešno obrisana.']);
    }


}