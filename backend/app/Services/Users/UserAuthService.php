<?php

namespace App\Services\Users;

use App\Models\User;
use App\Notifications\WelcomeMessageNotification;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class UserAuthService
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function login(array $credentials): ?array
    {
        $user = User::where('email', operator: $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return null;
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return [
            'message' => 'user signed in successfully',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => [
                'user_id' => $user->id,
                'email' => $user->email,
                'username' => $user->username,
                'user_role' => $user->user_role,
                'avatar' => $user->avatar,
                'description' => $user->description ?? null,
            ],
        ];
    }

    public function logout(User $user): bool
    {
        $user->tokens()->delete();
        return true;
    }

    public function register(array $data): array
    {
        $email = $data['email'];
        $username = $data['username'];
        $gender = $data['gender'] ?? null;

        if (User::where('email', $email)->exists()) {
            return ['error' => 'This email already exist', 'code' => 400];
        }

        if (User::where('username', $username)->exists()) {
            return ['error' => 'The username is already taken. Please choose a different one.', 'code' => 400];
        }

        $seed = Str::slug($email) . '-' . Str::random(8);
        $avatarUrl = "https://api.dicebear.com/9.x/bottts/png?seed={$seed}";

        $user = User::create([
            'username' => $username,
            'email' => $email,
            'password' => Hash::make($data['password']),
            'user_role' => 'user',
            'avatar' => $avatarUrl,
            'gender' => $gender,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        $user->notify(new WelcomeMessageNotification('Welcome to our platform, ' . $user->email . '! We are excited to have you on board.'));

        return [
            'message' => 'User registered',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => [
                'user_id' => $user->id,
                'email' => $user->email,
                'username' => $user->username,
                'user_role' => $user->user_role,
                'avatar' => $user->avatar,
            ],
        ];
    }

    public function getGoogleAuthUrl(): string
    {
        return Socialite::driver('google')
            ->stateless()
            ->redirect()
            ->getTargetUrl();
    }

    public function handleGoogleCallback(): array
    {
        try {
            $socialiteUser = Socialite::driver('google')->stateless()->user();
        } catch (ClientException $e) {
            return ['error' => 'Invalid credentials provided.', 'code' => 422];
        }

        $user = User::firstOrCreate(
            [
                'email' => $socialiteUser->getEmail(),
            ],
            [
                'username' => $socialiteUser->getName(),
                'password' => '',
                'user_role' => 'admin',
                'avatar' => $socialiteUser->getAvatar(),
            ]
        );

        return [
            'user' => $user,
            'access_token' => $user->createToken('auth_token')->plainTextToken,
            'token_type' => 'Bearer',
        ];
    }
}
