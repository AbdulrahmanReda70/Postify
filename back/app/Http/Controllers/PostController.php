<?php

namespace App\Http\Controllers;

use App\Models\Like;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use PDO;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function get_user_posts()
    {

        $posts = Post::where('user_id', Auth::user()->id)->withExists('savedByUsers as is_saved')->latest()->get();

        return response()->json([
            'posts' => $posts
        ], 200);
    }

    public function get_saved_posts()
    {
        $posts = Auth::user()->savedPosts()->with('user')->latest()->get();


        return response()->json([
            'posts' => $posts
        ], 200);
    }

    public function get_post_view($id)
    {
        //find($id)
        $post = Post::withExists(['likedByUsers as liked'])->find($id);
        $postArr = $post->toArray();
        $postArr['likes_count'] = $post->likedByUsers()->count();

        if (!$post) {
            return response()->json(['message' => 'Post not found'], 404);
        }
        return response()->json($postArr);
    }

    public function get_post_edit($id)
    {

        // $post = Post::where('id', $id)
        //     ->first();

        $post = Post::withExists(['likedByUsers as liked'])->find($id);
        $postArr = $post->toArray();
        $postArr['likes_count'] = $post->likedByUsers()->count();

        if (!$post) {
            return response()->json(['message' => 'Post not found'], 404);
        }
        return response()->json($postArr);
    }

    public function get_home_posts()
    {

        $start = microtime(true);

        $home_posts = Post::with('user')->withExists(['savedByUsers as is_saved' => fn($q) => $q->where('user_id', Auth::id())])->latest()->paginate(5);
        // $saved_posts = Auth::user()->savedPosts()->pluck('post_id'); // just get saved post IDs

        // foreach ($home_posts as $post) {
        //     $post->is_saved = $saved_posts->contains($post->id);
        // }

        if (count($home_posts) <= 0 && $home_posts) {
            return response()->json(['message' => 'no Posts found'], 404);
        }
        $end = microtime(true);

        $executionTime = $end - $start;
        return response()->json(['posts' => $home_posts, 'executionTime' => $executionTime], 200);
    }


    public function create_post(Request $request)
    {

        request()->validate([
            'title' => 'min:5',
            'body' => 'min:20'
        ]);

        $user_id = Auth::user()->id;
        $title = request()->title;
        $body = request()->body;

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('posts', 'public');
        }

        $post = Post::create([
            'user_id' => $user_id,
            'title' => $title,
            'body' => $body,
            'image' => $imagePath
        ]);

        if ($post) {
            return response()->json([
                'message' => 'Post created successfully!',
                'post' => $post
            ], 201); // 201 for resource created
        } else {
            return response()->json([
                'message' => 'Failed to create post.'
            ], 500); // 500 for server error
        }
    }

    public function update_post(Post $post)
    {

        request()->validate([
            'title' => 'required|min:5|string',
            'body' => 'required|min:20|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048' // Max size 2MB
        ]);

        $title = request()->title;
        $body = request()->body;
        $imagePath = null;

        if (request()->hasFile('image')) {
            $imagePath = request()->file('image')->store('posts', 'public');
            $last_path = $post->image;
            if ($last_path) {
                Storage::disk('public')->delete($last_path);
            }
        }

        $post->update([
            'title' => $title,
            'body' => $body,
            'image' =>  $imagePath
        ]);
        return response()->json([
            'message' => 'Post updated successfully!',
            'post' => $post
        ], 201); // 201 for resource created
        if ($post) {
            return response()->json([
                'message' => 'Post updated successfully!',
                'post' => $post
            ], 201); // 201 for resource created
        } else {
            return response()->json([
                'message' => 'Failed to updated post.'
            ], 500); // 500 for server error
        }
    }

    public function delete_post(Post $post)
    {
        if ($post) {
            $post->delete();
            return response()->json([
                'message' => 'Post deleted successfully!',
                'post' => $post
            ], 201); // 201 for resource created
        } else {
            return response()->json([
                'message' => 'Failed to deleted post.'
            ], 500); // 500 for server error
        }
    }

    public function post_search()
    {
        $query = request()->input('query');

        $posts = Post::where('title', 'LIKE', "%{$query}%")
            ->orWhere('body', 'LIKE', "%{$query}%")
            ->paginate(10);

        return response()->json($posts); // Return JSON response
    }
}
