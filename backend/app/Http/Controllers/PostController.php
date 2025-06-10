<?php

namespace App\Http\Controllers;

use Laravel\Telescope\Telescope;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log as FacadesLog;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image;
use PgSql\Lob;
use Illuminate\Support\Facades\Log;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function firstPost()
    {
        $post = Post::with('user')->withExists(['savedByUsers as is_saved' => fn($q) => $q->where('user_id', Auth::id())])->where('is_hero', true)->latest()->first();
        $postArr = $post->toArray();
        // $postArr['likes_count'] = $post->likedByUsers()->count();
        $postArr['section'] = 'home';
        $postArr['is_first_post'] = true;


        if (!$post) {
            return response()->json(['message' => 'Post not found'], 404);
        }
        return response()->json([
            'post' => $postArr
        ], 200);
    }

    public function getUserPosts()
    {
        $posts = Post::where('user_id', Auth::user()->id)->withExists('savedByUsers as is_saved')->latest()->get();
        foreach ($posts as $p) {
            $p['section'] = 'history';
        }
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
        //find($id)
        $post = Post::where('id', $id)
            ->withExists(['likedByUsers as liked'])
            ->first();
        $postArr = $post->toArray();
        $postArr['likes_count'] = $post->likedByUsers()->count();

        $canUpdate = Gate::allows('update', $post);

        if (!$post) {
            return response()->json(['message' => 'Post not found'], 404);
        }

        $postClass = get_class($post);
        return response()->json([
            'post' => $postArr,
            'canUpdate' => $canUpdate,
            'class' => $postClass,
        ], 200);
    }

    public function getUserPost($id)
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

    public function getHomePosts()
    {

        $page = request()->get('page', 1);

        $home_posts = Post::with('user')
            ->withExists([
                'savedByUsers as is_saved' => fn($q) => $q->where('user_id', Auth::id())
            ])
            ->latest()
            ->paginate(5);


        $posts = $home_posts->getCollection()->slice(1)->values();
        foreach ($posts as $p) {
            $p['section'] = 'home';
            $p['canUpdate'] = Gate::allows('canEdit', $p);
        }

        $home_posts = $home_posts->setCollection($posts);

        Log::info($home_posts);


        // $saved_posts = Auth::user()->savedPosts()->pluck('post_id'); // just get saved post IDs

        // foreach ($home_posts as $post) {
        //     $post->is_saved = $saved_posts->contains($post->id);
        // }

        // if ($home_posts->isEmpty()) {
        //     return response()->json(['message' => 'no Posts found'], 404);
        // }

        return response()->json(['posts' => $home_posts], 200);
    }


    public function store(Request $request)
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
            // Get the uploaded image
            $image = $request->file('image');

            // Create an image resource from the uploaded image (depending on the file type)
            $img = imagecreatefromstring(file_get_contents($image));

            // Get original dimensions
            $originalWidth = imagesx($img);
            $originalHeight = imagesy($img);

            // Resize image to fit within 150x140 while maintaining aspect ratio
            $targetWidth = 300;
            $targetHeight = 280;

            // Calculate aspect ratio
            $aspectRatio = $originalWidth / $originalHeight;

            if ($originalWidth > $originalHeight) {
                $newWidth = $targetWidth;
                $newHeight = round($targetWidth / $aspectRatio);
            } else {
                $newHeight = $targetHeight;
                $newWidth = round($targetHeight * $aspectRatio);
            }

            // Create a new true color image with the target dimensions
            $resizedImg = imagecreatetruecolor($newWidth, $newHeight);

            // Preserve transparency (if applicable)
            if (imagesavealpha($img, true)) {
                imagealphablending($resizedImg, false);
                imagesavealpha($resizedImg, true);
            }

            // Copy and resize the original image into the resized image
            imagecopyresampled($resizedImg, $img, 0, 0, 0, 0, $newWidth, $newHeight, $originalWidth, $originalHeight);

            // Define the path for saving the WebP image
            $webpPath = public_path('storage/posts/' . uniqid() . '.webp');

            // Save the resized image as WebP with better quality
            $quality = 90; // Adjust this value between 0 and 100 for better quality (higher means better quality)
            imagewebp($resizedImg, $webpPath, $quality);

            // Free up memory
            imagedestroy($img);
            imagedestroy($resizedImg);

            // Save the relative path to the WebP image
            $imagePath = 'posts/' . basename($webpPath);
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

    public function update(Post $post)
    {

        request()->validate([
            'title' => 'required|min:5|string',
            'body' => 'required|min:20|string',
            // 'image' => 'nullable|image|max:2048' // Max size 2MB
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
            $post->update([
                'title' => $title,
                'body' => $body,
                'image' =>  $imagePath
            ]);
        } else {
            $post->update([
                'title' => $title,
                'body' => $body,
            ]);
        }

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

    public function delete(Post $post)
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

    public function postSearch()
    {
        $query = request()->input('query');

        $posts = Post::where('title', 'LIKE', "%{$query}%")
            ->orWhere('body', 'LIKE', "%{$query}%")
            ->paginate(10);

        return response()->json($posts); // Return JSON response
    }
}
