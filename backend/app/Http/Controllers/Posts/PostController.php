<?php

namespace App\Http\Controllers\Posts;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use App\Jobs\CreatePost;
use App\Jobs\UpdatePost;
use App\Jobs\DeletePost;
use App\Models\Post;
use App\Services\ImageResizer;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Gate;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */

     public function store(StorePostRequest $request, ImageResizer $imageResizer)
     {

            dispatch_sync(CreatePost::fromRequest($request, $imageResizer));

            return response()->json([
                'message' => 'Post created successfully!',
             ], 201); // 201 for resource created

     }


    public function getUserPosts()
    {
        $posts = Post::forAuthenticatedUser()
            ->get()
            ->map(function ($post) {
                $post->section = 'history';
                return $post;
            });

        return response()->json([
            'posts' => $posts
        ], 200);
    }

    public function getSavedPosts()
    {
        $posts = Auth::user()->savedPosts()->with('user')->latest()->get();

        return response()->json([
            'posts' => $posts
        ], 200);
    }

    public function getPost($id)
    {

        $post = Post::where('id', $id)
        ->withExists([
            'likedByUsers as liked' => fn($q) => $q->where('user_id', Auth::id())
        ])
        ->first();

        // TODO:Change this to more cleaner way (Make this in the frontend by AuthU_id & visitedU_id)
        $canUpdate = Gate::allows('update', $post);

        if (!$post) {
            return response()->json(['message' => 'Post not found'], 404);
        }

        return response()->json([
            'post' => $post,
            'canUpdate' => $canUpdate, // TODO: Remove this transfer the logic to the frontend
        ], 200);
    }

    public function getUserPost($id)
    {

        $post = Post::withExists(['likedByUsers as liked'])->find($id);
        $postArr = $post->toArray();
        $postArr['likes_count'] = $post->likedByUsers()->count();

        if (!$post) {
            return response()->json(['message' => 'Post not found'], 404);
        }
        return response()->json($postArr);
    }

    public function getHomePosts()
    {

        $page = request()->get('page', 1);
        $home_posts = Cache::remember('home_posts_page_' . $page, now()->addMinutes(10), function () {
            return Post::getHomePosts();
        });

        $posts = $home_posts->getCollection()->slice(1)->values();
        foreach ($posts as $p) {
            $p['section'] = 'home';
            $p['canUpdate'] = Gate::allows('canEdit', $p); // TODO: Remove this
        }

        $home_posts = $home_posts->setCollection($posts);

        return response()->json(['posts' => $home_posts], 200);
    }



    public function update(UpdatePostRequest $request, Post $post, ImageResizer $imageResizer)
    {
        dispatch_sync(UpdatePost::fromRequest($request, $post, $imageResizer));

        $post->refresh();

        return response()->json([
            'message' => 'Post updated successfully!',
            'post' => $post,
        ], 200);
    }


    public function destroy(Post $post)
    {
        dispatch_sync(new DeletePost($post));

        return response()->json([
            'message' => 'Post deleted successfully!',
        ], 200);
    }

    // TODO: use Laravel Scout instead of this
    public function postSearch()
    {
        $query = request()->input('query');

            $posts = Post::where('title', 'LIKE', "%{$query}%")
                ->orWhere('body', 'LIKE', "%{$query}%")
                ->paginate(10);

        return response()->json($posts); // Return JSON response
    }
}
