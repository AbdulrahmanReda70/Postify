<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Services\Users\UserAuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class LoginController extends Controller
{

    public function login(LoginRequest $request, UserAuthService $authService)
    {
        $credentials = $request->only(['email', 'password']);
        $result = $authService->login($credentials);

        if (!$result) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        return response()->json($result);
    }

    public function logout(Request $request, UserAuthService $authService)
    {
        $authService->logout($request->user());
        return response()->json(['message' => 'Logged out successfully']);
    }

    public function redirectToAuth(UserAuthService $authService): JsonResponse
    {
        return response()->json([
            'url' => $authService->getGoogleAuthUrl(),
        ]);
    }

    public function handleAuthCallback(): JsonResponse
    {
        // keep original behavior while delegating to the service if needed
        try {
            $socialiteUser = \Laravel\Socialite\Facades\Socialite::driver('google')->stateless()->user();
        } catch (\GuzzleHttp\Exception\ClientException $e) {
            Log::error('Socialite callback failed', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Invalid credentials provided.'], 422);
        }

        $user = \App\Models\User::firstOrCreate(
            ['email' => $socialiteUser->getEmail()],
            [
                'username' => $socialiteUser->getName(),
                'password' => '',
                'user_role' => 'admin',
                'avatar' => $socialiteUser->getAvatar(),
            ]
        );

        return response()->json([
            'user' => $user,
            'access_token' => $user->createToken('auth_token')->plainTextToken,
            'token_type' => 'Bearer',
        ]);
    }
}
