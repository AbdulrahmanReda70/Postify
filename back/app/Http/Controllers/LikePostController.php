<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LikePostController extends Controller
{
    public function likePost(Post $post)
    {
        $user = Auth::user();
        $user_id = $user->id;
        $post_id = $post->id;

        $liked_post = $user->likedPosts()->where('post_id', $post_id)->exists();

        if (!$liked_post) {
            $user->likedPosts()->attach($post_id);
            return response()->json(['message' => 'Post has been liked successfully', 'liked' => true], 200);
        }

        $user->likedPosts()->detach($post_id);
        return response()->json(['message' => 'Post like removed successfully', 'liked' => false], 200);
    }
}
