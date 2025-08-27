<?php

namespace App\Http\Controllers\Posts;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\Post;
use App\Services\Posts\PostInteractionsService;
use Illuminate\Http\Request;

class PostCommentsController extends Controller
{


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Post $post, PostInteractionsService $service)
    {
        $data = $request->validate([
            'body' => 'required|string|min:1|max:1000'
        ]);

        $comment = $service->createComment($data, $post);

        return response()->json([
            'comment' => $comment,
        ], 201); // 201 for resource created
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Post $post, Comment $comment, PostInteractionsService $service)
    {
        $data = $request->validate([
            'body' => 'required|string|min:1|max:1000'
        ]);

        $updatedComment = $service->updateComment($data, $comment);

        if (!$updatedComment) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        return response()->json([
            'comment' => $updatedComment,
        ]);
    }

    public function updateCommentReactions(Request $request, Post $post, Comment $comment, PostInteractionsService $service)
    {
        $data = $request->validate([
            'type' => 'required|string|in:like,dislike,love,celebrate',
        ]);

        $result = $service->updateCommentReactions($data, $comment);
        $statusCode = $result['code'] ?? 200;
        unset($result['code']);

        return response()->json($result, $statusCode);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Comment $comment, PostInteractionsService $service)
    {
        $deleted = $service->deleteComment($comment);

        if (!$deleted) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        return response()->json([
            'message' => 'Comment deleted successfully',
        ], 200); // 200 for successful deletion
    }
}
