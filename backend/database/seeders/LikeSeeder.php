<?php

namespace Database\Seeders;

use App\Models\Like;
use App\Models\User;
use App\Models\Post;
use Illuminate\Database\Seeder;

class LikeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create 10 users if they don't exist
        $users = User::factory(10)->create();
        
        // Create 20 posts if they don't exist
        $posts = Post::factory(20)->create();
        
        // Create 50 likes with random user-post combinations
        // Ensure no duplicate likes (same user liking same post)
        $createdLikes = [];
        
        for ($i = 0; $i < 50; $i++) {
            $userId = $users->random()->id;
            $postId = $posts->random()->id;
            
            // Check if this combination already exists
            $key = $userId . '-' . $postId;
            if (!isset($createdLikes[$key])) {
                Like::factory()->forUserAndPost($userId, $postId)->create();
                $createdLikes[$key] = true;
            }
        }
        
        // Alternative approach: Create likes for specific scenarios
        // Each user likes at least one post
        foreach ($users as $user) {
            $randomPost = $posts->random();
            $key = $user->id . '-' . $randomPost->id;
            
            if (!isset($createdLikes[$key])) {
                Like::factory()->forUserAndPost($user->id, $randomPost->id)->create();
                $createdLikes[$key] = true;
            }
        }
        
        // Each post gets liked by at least one user
        foreach ($posts as $post) {
            $randomUser = $users->random();
            $key = $randomUser->id . '-' . $post->id;
            
            if (!isset($createdLikes[$key])) {
                Like::factory()->forUserAndPost($randomUser->id, $post->id)->create();
                $createdLikes[$key] = true;
            }
        }
        
        echo "Created likes with user-post relationships successfully!\n";
    }
}
