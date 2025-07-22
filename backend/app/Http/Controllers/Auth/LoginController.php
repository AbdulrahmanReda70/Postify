<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Models\User;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Auth\Events\Login;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\JsonResponse;
use Laravel\Socialite\Facades\Socialite;

class LoginController extends Controller
{

    public function login(LoginRequest $request)
    {

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

        $user = User::firstOrCreate(
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
}
