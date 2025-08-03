<?php

namespace App\Http\Controllers\Posts;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreatePostComment;
use App\Http\Requests\StoreCommentRequest;
use App\Models\Comment;
use App\Models\Post;
use Auth;
use Illuminate\Http\Request;

class PostCommentsController extends Controller
{


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Post $post)
    {
        $data = $request->validate([
            'body' => 'required|string|min:1|max:1000'
        ]);
        $user_id = Auth::id();
        $body = $data['body'];
        $post_id = $post->id;

        $comment = Comment::create([
            'post_id' => $post_id,
            'user_id' => $user_id,
            'body' => $body,
            'like' => 0,
            'dislike' => 0,
            'love' => 0,
            'celebrate' => 0
        ]);

        return response()->json([
            'comment' => $comment,
        ], 201); // 201 for resource created
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Post $post, Comment $comment)
    {

        $data = $request->validate([
            'body' => 'required|string|min:1|max:1000'
        ]);
        $user_id = Auth::id();
        $body = $data['body'];

        if ($comment->user_id !== $user_id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $comment->body = $body;
        $comment->save();

        return response()->json([
            'comment' => $comment,
        ]);
    }

    public function updateReaction(Request $request, Post $post, Comment $comment)
    {
        $data = $request->validate([
            'type' => 'required|string|in:like,dislike,love,celebrate',
        ]);
        $type = $data['type'];

        return response()->json([
            'comment' => $comment,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Comment $comment)
    {
        $user_id = Auth::id();

        if ($comment->user_id !== $user_id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $comment->delete();

        return response()->json([
            'message' => 'Comment deleted successfully',
        ], 200); // 200 for successful deletion
    }
}
