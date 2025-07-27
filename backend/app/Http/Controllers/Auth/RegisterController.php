<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;


class RegisterController extends Controller
{
    public function register(RegisterRequest $request)
    {

        $email = $request->email;
        $gender = $request->gender;
        $username = $request->username;


        if (User::where('email', $email)->exists()) {
            return response()->json(['error' => 'This email already exist'], 400);
        };

        if (User::where('username', $username)->exists()) {
            return response()->json(['error' => 'The username is already taken. Please choose a different one.'], 400);
        };

        // Generate a unique seed for DiceBear (e.g., using the email)
        $seed = Str::slug($email) . '-' . Str::random(8);
        $avatarUrl = "https://api.dicebear.com/9.x/bottts/png?seed={$seed}";

        $user = User::create([
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'user_role' => 'admin',
            'avatar' => $avatarUrl,
            'gender' => $gender
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'User registered',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => [
                'user_id' => $user->id,
                'email' => $user->email,
                'username' => $user->username,
                'user_role' => $user->user_role,
                'avatar' => $user->avatar,
            ]
        ]);
    }


}
