<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\SavedPost;

use Illuminate\Support\Facades\Auth;

class SavedPostController extends Controller
{
    public function toggle(Post $post)
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
