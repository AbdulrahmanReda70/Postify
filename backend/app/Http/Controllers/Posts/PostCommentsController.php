<?php

namespace App\Http\Controllers\Posts;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreatePostComment;
use App\Http\Requests\StoreCommentRequest;
use App\Models\Comment;
use App\Models\CommentReaction;
use App\Models\Post;
use Auth;
use Illuminate\Http\Request;
use Illuminate\Log\Logger;

use function PHPSTORM_META\type;

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

    public function updateCommentReactions(Request $request, Post $post, Comment $comment)
    {
        try {
            $data = $request->validate([
                'type' => 'required|string|in:like,dislike,love,celebrate',
            ]);

            $type = $data['type'];
            $user_id = Auth::id();

            $prev_reaction = CommentReaction::where('user_id', $user_id)
                ->where('comment_id', $comment->id)
                ->first();

            // if there is no reaction exist create new one
            if (!$prev_reaction) {
                CommentReaction::create([
                    'user_id' => $user_id,
                    'comment_id' => $comment->id,
                    'reaction_type' => $type
                ]);
                return response()->json([
                    'status' => 'success',
                    'message' => 'Comment reaction created successfully'
                ], 201);
            }

            $prev_reaction_type = $prev_reaction->reaction_type;

            // if reaction exist but not the same type -> update
            if ($prev_reaction_type !== $type) {
                $prev_reaction->reaction_type = $type;
                $prev_reaction->save();
                return response()->json([
                    'status' => 'success',
                    'message' => 'Comment reaction updated successfully'
                ], 200);
            }

            // if reaction exist and the same type -> delete
            if ($prev_reaction_type === $type) {
                $prev_reaction->delete();
                return response()->json([
                    'status' => 'success',
                    'message' => 'Comment reaction deleted successfully'
                ], 200);
            }

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to process reaction'
            ], 400);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred while processing the reaction',
                'error' => $e->getMessage()
            ], 500);
        }
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
