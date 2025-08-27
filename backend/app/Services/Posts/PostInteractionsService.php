<?php

namespace App\Services\Posts;

use App\Models\Comment;
use App\Models\CommentReaction;
use App\Models\Post;
use App\Models\SavedPost;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PostInteractionsService
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function togglePostLike(Post $post): array
    {
        $user = Auth::user();
        $post_id = $post->id;
        $liked_post = $user->likedPosts()->where('post_id', $post_id)->exists();

        if (!$liked_post) {
            $user->likedPosts()->attach($post_id);
            return ['message' => 'Post has been liked successfully', 'liked' => true];
        }

        $user->likedPosts()->detach($post_id);
        return ['message' => 'Post like removed successfully', 'liked' => false];
    }

    public function togglePostSave(Post $post): array
    {
        $user = Auth::user();
        $user_id = $user->id;
        $post_id = $post->id;

        $saved_post = SavedPost::where('user_id', $user_id)->where('post_id', $post_id)->first();
        if (!$saved_post) {
            $user->savedPosts()->attach($post_id);
            return ['message' => 'Post saved successfully', 'saved' => true];
        }

        $saved_post->delete();
        return ['message' => 'Post successfully removed from saved items', 'saved' => false];
    }

    public function createComment(array $data, Post $post): Comment
    {
        $user_id = Auth::id();
        $body = $data['body'];
        $post_id = $post->id;

        return Comment::create([
            'post_id' => $post_id,
            'user_id' => $user_id,
            'body' => $body,
        ]);
    }

    public function updateComment(array $data, Comment $comment): ?Comment
    {
        $user_id = Auth::id();
        $body = $data['body'];

        if ($comment->user_id !== $user_id) {
            return null; // Unauthorized
        }

        $comment->body = $body;
        $comment->save();

        return $comment;
    }

    public function updateCommentReactions(array $data, Comment $comment): array
    {
        try {
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
                return [
                    'status' => 'success',
                    'message' => 'Comment reaction created successfully',
                    'code' => 201
                ];
            }

            $prev_reaction_type = $prev_reaction->reaction_type;

            // if reaction exist but not the same type -> update
            if ($prev_reaction_type !== $type) {
                $prev_reaction->reaction_type = $type;
                $prev_reaction->save();
                return [
                    'status' => 'success',
                    'message' => 'Comment reaction updated successfully',
                    'code' => 200
                ];
            }

            // if reaction exist and the same type -> delete
            if ($prev_reaction_type === $type) {
                $prev_reaction->delete();
                return [
                    'status' => 'success',
                    'message' => 'Comment reaction deleted successfully',
                    'code' => 200
                ];
            }

            return [
                'status' => 'error',
                'message' => 'Failed to process reaction',
                'code' => 400
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'error',
                'message' => 'An error occurred while processing the reaction',
                'error' => $e->getMessage(),
                'code' => 500
            ];
        }
    }

    public function deleteComment(Comment $comment): bool
    {
        $user_id = Auth::id();

        if ($comment->user_id !== $user_id) {
            return false; // Unauthorized
        }

        $comment->delete();
        return true;
    }
}
