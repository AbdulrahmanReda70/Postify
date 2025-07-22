<?php

namespace App\Http\Controllers\Posts;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\SavedPost;
use Illuminate\Support\Facades\Auth;

class PostInteractionController extends Controller
{
    public function togglePostLike(Post $post)
    {
        $user = Auth::user();
        $post_id = $post->id;
        $liked_post = $user->likedPosts()->where('post_id', $post_id)->exists();

        if (!$liked_post) {
            $user->likedPosts()->attach($post_id);
            return response()->json(['message' => 'Post has been liked successfully', 'liked' => true], 200);
        }

        $user->likedPosts()->detach($post_id);
        return response()->json(['message' => 'Post like removed successfully', 'liked' => false], 200);
    }


    public function togglePostSave(Post $post)
    {
        $user = Auth::user();
        $user_id = $user->id;
        $post_id = $post->id;

        $saved_post = SavedPost::where('user_id', $user_id)->where('post_id', $post_id)->first();
        if (!$saved_post) {
            $user->savedPosts()->attach($post_id);
            return response()->json(['message' => 'Post saved successfully', 'saved' => true], 200);
        }

        $saved_post->delete();
        return response()->json(['message' => 'Post successfully removed from saved items', 'saved' => false], 200);
    }
}
