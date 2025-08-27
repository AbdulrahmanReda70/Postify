<?php

namespace App\Http\Controllers\Posts;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Services\Posts\PostInteractionsService;

class PostInteractionController extends Controller
{
    public function togglePostLike(Post $post, PostInteractionsService $service)
    {
        $result = $service->togglePostLike($post);
        return response()->json($result, 200);
    }

    public function togglePostSave(Post $post, PostInteractionsService $service)
    {
        $result = $service->togglePostSave($post);
        return response()->json($result, 200);
    }
}
