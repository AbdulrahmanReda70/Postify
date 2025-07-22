<?php

/**
 * Example usage of LikeFactory
 * 
 * This file demonstrates how to use the LikeFactory in various scenarios.
 * You can use these examples in your controllers, tests, or seeders.
 */

// Basic usage - creates a like with new user and post
use App\Models\Like;
use App\Models\User;
use App\Models\Post;

// Example 1: Create a like with new user and post
$like = Like::factory()->create();

// Example 2: Create multiple likes
$likes = Like::factory(10)->create();

// Example 3: Create a like for existing user and post
$user = User::find(1);
$post = Post::find(1);
$like = Like::factory()->forUserAndPost($user->id, $post->id)->create();

// Example 4: Create a like for existing user with new post
$user = User::find(1);
$like = Like::factory()->forUser($user->id)->create();

// Example 5: Create a like for existing post with new user
$post = Post::find(1);
$like = Like::factory()->forPost($post->id)->create();

// Example 6: Create likes in bulk for specific user
$user = User::find(1);
$likes = Like::factory(5)->forUser($user->id)->create();

// Example 7: Create likes in bulk for specific post
$post = Post::find(1);
$likes = Like::factory(3)->forPost($post->id)->create();

// Example 8: Using in tests
/*
public function test_user_can_like_post()
{
    $user = User::factory()->create();
    $post = Post::factory()->create();
    
    $like = Like::factory()->forUserAndPost($user->id, $post->id)->create();
    
    $this->assertDatabaseHas('liked_posts', [
        'user_id' => $user->id,
        'post_id' => $post->id,
    ]);
}
*/

// Example 9: Using with relationships
/*
// Get all likes for a user
$user = User::find(1);
$userLikes = $user->likes; // Assuming you have the relationship defined

// Get all likes for a post
$post = Post::find(1);
$postLikes = $post->likes; // Assuming you have the relationship defined

// Count likes for a post
$post = Post::find(1);
$likesCount = $post->likes()->count();
*/
