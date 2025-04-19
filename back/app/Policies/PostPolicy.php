<?php

namespace App\Policies;

use App\Models\Post;
use App\Models\User;

class PostPolicy
{
    /**
     * Determine if the given post can be updated by the user.
     */
    public function update(User $user, Post $post): bool
    {
        // Only the post owner can update the post
        return $user->id === $post->user_id;
    }

    public function delete(User $user, Post $post): bool
    {
        // Only the post owner can update the post
        return $user->id === $post->user_id;
    }
}
