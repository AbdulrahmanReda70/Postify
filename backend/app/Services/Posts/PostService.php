<?php

namespace App\Services\Posts;

use App\Events\PostPublished;
use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use App\Jobs\DeletePost;
use App\Jobs\UpdatePost;
use App\Models\CommentReaction;
use App\Models\Post;
use Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;

class PostService
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function createPost(StorePostRequest $request)
    {

        $imagePath = null;

        if ($request->hasFile('image')) {
            // Get the uploaded image
            $image = $request->file('image');

            try {
                // Store on the app's configured default filesystem disk
                $imagePath = $image->store('posts/images', config('filesystems.default'));
                Log::info('Image uploaded successfully to S3', [
                    'path' => $imagePath,
                    'original_name' => $image->getClientOriginalName(),
                    'size' => $image->getSize()
                ]);
            } catch (\Exception $e) {
                Log::error('Failed to upload image to S3', [
                    'error' => $e->getMessage(),
                    'original_name' => $image->getClientOriginalName()
                ]);
                throw $e;
            }

            if (!$imagePath) {
                Log::error('Image upload returned null/false', [
                    'original_name' => $image->getClientOriginalName()
                ]);
                throw new \Exception('Failed to upload image to S3');
            }
        }

        $post = Post::create([
            'user_id' => Auth::id(),
            'title' => $request->title,
            'body' => $request->body,
            'image' => $imagePath,
        ]);
        event(new PostPublished($post));
        return $post;
    }

    public function getCurrentUserPosts()
    {
        $posts = Post::forAuthenticatedUser()
            ->get()
            ->map(function ($post) {
                return $post;
            });

        return $posts;
    }

    public function getCurrentUserSavedPosts()
    {
        $posts = Auth::user()->savedPosts()->with('user')->latest()->get();
        return $posts;
    }

    public function getPost(int $id): ?array
    {
        $post = Post::with(['user'])
            ->withExists([
                'likedByUsers as liked' => fn($q) => $q->where('user_id', Auth::id())
            ])
            ->find($id);

        if (!$post) {
            return null;
        }

        // Collect comment IDs
        $commentIds = $post->comments->pluck('id')->toArray();

        // Fetch reactions counts
        $reactionCounts = !empty($commentIds)
            ? CommentReaction::getReactionCountsForComments($commentIds)
            : collect();

        // Attach counts to each comment
        $post->comments->each(function ($comment) use ($reactionCounts) {
            $counts = $reactionCounts[$comment->id] ?? null;
            $comment->likes = $counts->likes ?? 0;
            $comment->dislikes = $counts->dislikes ?? 0;
            $comment->celebrates = $counts->celebrates ?? 0;
            $comment->loves = $counts->loves ?? 0;
        });

        return [
            'post' => $post,
            'comments' => $post->comments,
        ];
    }

    public function getUserPost(int $id): ?array
    {
        $post = Post::with('comments')->withExists(['likedByUsers as liked'])->find($id);
        if (!$post) {
            return null;
        }

        $postArr = $post->toArray();
        $postArr['likes_count'] = $post->likedByUsers()->count();
        return $postArr;
    }

    public function getHomePosts(?int $page = null)
    {
        $cacheKey = 'home_posts_page_' . ($page ?? 1);
        $ttl = 60; // Cache for 60 seconds (adjust as needed)

        return \Cache::remember($cacheKey, $ttl, function () {
            $home_posts = Post::getHomePosts();

            // Cast to LengthAwarePaginator to access getCollection and setCollection methods
            /** @var \Illuminate\Pagination\LengthAwarePaginator $home_posts */
            $posts = $home_posts->getCollection()->slice(1)->values();
            foreach ($posts as $p) {
                $p['canUpdate'] = Gate::allows('canEdit', $p); // TODO: Remove this
            }

            return $home_posts->setCollection($posts);
        });
    }

    public function updatePost(UpdatePostRequest $request, Post $post): Post
    {
        dispatch_sync(UpdatePost::fromRequest($request, $post));
        $post->refresh();
        return $post;
    }

    public function deletePost(Post $post): bool
    {
        dispatch_sync(new DeletePost($post));
        return true;
    }

    public function searchPosts(string $query, int $perPage = 10)
    {
        return Post::where('title', 'LIKE', "%{$query}%")
            ->orWhere('body', 'LIKE', "%{$query}%")
            ->paginate($perPage);
    }
}
