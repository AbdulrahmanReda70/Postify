<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Notifications\Ads;
use Illuminate\Http\Request;

class FireController extends Controller
{
    public function sendAds()
    {
        $users = User::all();
        $message = 'This Ad from Abdelrahman reda';

        if ($users->isEmpty()) {
            return response()->json(['message' => 'No users found']);
        }

        // Broadcast to the first user only (this will send the real-time notification)
        $users->first()->notify(new Ads($message));

        // Save to database for remaining users (no broadcast)
        foreach ($users->skip(1) as $user) {
            // Use database channel only
            $user->notifications()->create([
                'id' => \Illuminate\Support\Str::uuid(),
                'type' => Ads::class,
                'data' => [
                    'message' => $message,
                    'time' => now()->toDateTimeString(),
                ],
                'read_at' => null,
            ]);
        }

        return response()->json(['message' => 'Ads sent to all users']);
    }
}
