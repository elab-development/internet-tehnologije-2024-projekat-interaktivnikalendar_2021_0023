<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Korisnik;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'ime' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
        ]);
    
        $user = User::create([
            'name' => $validated['ime'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);
    
        Korisnik::create([
            'user_id' => $user->id,
            'ime' => $validated['ime'],
            'email' => $validated['email'],
            'sifra' => $validated['password'],
            'uloga_id' => 3, // Automatski postavi uloga_id na 3
        ]);
    
        $token = $user->createToken('auth_token')->plainTextToken;
    
        return response()->json(['access_token' => $token, 'token_type' => 'Bearer'], 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt(['email' => $credentials['email'], 'password' => $credentials['password']])) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $user = Auth::user();
        $korisnik = Korisnik::where('email', $credentials['email'])->first();

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'role' => $korisnik->uloga->naziv,
        ], 200);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Successfully logged out'], 200);
    }
}