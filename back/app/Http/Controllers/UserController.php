<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{

    public function getVisitedUser(User $user)
    {
        // Load the user's posts relationship and hide the password field
        $user_id = $user->id;
        $auth_user_id = Auth::user()->id;

        $user = $user->makeHidden(['password', 'updated_at', 'created_at', 'user_role']);
        $posts = Post::where('user_id', $user_id)->withExists(['savedByUsers as is_saved' => function ($query) use ($auth_user_id) {
            $query->where('user_id', $auth_user_id);
        }])->latest()->get();

        return response()->json(
            [
                'user' => $user,
                'posts' => $posts
            ],
            200
        );
    }



    public function deleteUserAccount(Request $request)
    {
        $user =  Auth::user();
        $user->tokens()->delete(); // Delete all tokens for the user
        $user->delete(); // Delete the user account
        return response()->json(['message' => 'User account deleted successfully'], 200);
    }

    public function updateUserData(Request $request)
    {
        $user =  Auth::user();
        $username = request()->username;
        $email = request()->email;

        request()->validate([
            'email' => 'email| ',
            'username' => 'string|max:255',
            'password' => 'string|min:6',
        ], [
            'email.email' => 'The email must be a valid email address.',
        ]);

        if (User::where('email', $email)->exists() || $user->email == $email) {
            return response()->json(['error' => true, 'message' => 'Email already exists'], 422);
        }

        if (User::where('username', $username)->exists() || $user->username == $username) {
            return response()->json(['error' => true, 'message' => 'this username is already taken. Please choose a different one.'], 422);
        }

        $user->update($request->all());
        return response()->json(['message' => 'User data updated successfully', 'user' => [
            'user_id' => $user->id,
            'email' => $user->email,
            'username' => $user->username,
            'user_role' => $user->user_role,
            'avatar' => $user->avatar,
            'description' => $user->description
        ]], 200);
    }
}
