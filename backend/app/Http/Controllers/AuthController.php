<?php

namespace App\Http\Controllers;

use App\Models\User;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\JsonResponse;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;

class AuthController extends Controller
{

    public function test()
    {
        $user = User::find(22);
        $user->delete();
        return $user;
    }

    public function redirectToAuth(): JsonResponse
    {
        return response()->json([
            'url' => Socialite::driver('google')
                ->stateless()
                ->redirect()
                ->getTargetUrl(),
        ]);
    }

    public function handleAuthCallback(): JsonResponse
    {
        try {
            /**
             * Retrieve the authenticated user's information from Google using Socialite.
             *
             * This method uses the Socialite package to interact with Google's OAuth2 API.
             * It retrieves the user's details in a stateless manner, which is useful for
             * APIs or applications that do not use session state.
             *
             * @return \Laravel\Socialite\Contracts\User The authenticated user's information.
             *
             * @throws \Laravel\Socialite\Two\InvalidStateException If the state validation fails.
             * @throws \GuzzleHttp\Exception\GuzzleException If there is an HTTP request error.
             */
            $socialiteUser = Socialite::driver('google')->stateless()->user();
        } catch (ClientException $e) {
            return response()->json(['error' => 'Invalid credentials provided.'], 422);
        }

        $user = User::query()->firstOrCreate(
            [
                'email' => $socialiteUser->getEmail(),
            ],
            [
                'username' => $socialiteUser->getName(),
                'password' => '',
                'user_role' => 'admin',
                'avatar' => $socialiteUser->getAvatar(), // Use getAvatar() to retrieve the profile picture
            ]
        );

        return response()->json([
            'user' => $user,
            'access_token' => $user->createToken('auth_token')->plainTextToken,
            'token_type' => 'Bearer',
        ]);
    }


    public function register(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|min:6',
        ]);

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

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email|regex:/@/',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'user signed in successfully ',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => [
                'user_id' => $user->id,
                'email' => $user->email,
                'username' => $user->username,
                'user_role' => $user->user_role,
                'avatar' => $user->avatar,
                'description' => $user->description
            ]
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }
}
