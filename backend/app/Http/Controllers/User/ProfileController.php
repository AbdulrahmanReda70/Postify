<?php

namespace App\Http\Controllers\User;
use App\Models\Post;
use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateUserDataRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
class ProfileController extends Controller
{
    public function getVisitedUser(User $user)
    {
        // Load the user's posts relationship and hide the password field
        $user_id = $user->id;
        $posts = Post::where('user_id', $user_id)->latest()->get();

        return response()->json(
            [
                'user' => new UserResource($user),
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

    public function updateUserData(UpdateUserDataRequest $request)
    {

        $user =  Auth::user();
        $username = $request->username;
        $email = $request->email;

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
