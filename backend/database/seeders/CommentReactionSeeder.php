<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Comment;
use App\Models\CommentReaction;
use App\Models\Post;

class CommentReactionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // First, ensure we have some users (create additional if needed)
        if (User::count() < 5) {
            User::factory(5)->create();
        }

        // Get all users
        $users = User::all();

        // Create some posts if they don't exist
        if (Post::count() < 3) {
            foreach (range(1, 3) as $i) {
                Post::create([
                    'title' => fake()->sentence(4),
                    'body' => fake()->sentence(),
                    'image' => 'posts/default.jpg',
                    'user_id' => $users->random()->id,
                    'created_at' => fake()->dateTimeBetween('-60 days', '-30 days'),
                    'updated_at' => now(),
                ]);
            }
        }

        $posts = Post::all();

        // Create sample comments if they don't exist
        if (Comment::count() < 10) {
            foreach ($posts as $post) {
                // Create 3-4 comments per post
                for ($i = 0; $i < rand(3, 4); $i++) {
                    Comment::create([
                        'body' => fake()->sentence(rand(5, 15)),
                        'user_id' => $users->random()->id,
                        'post_id' => $post->id,
                        'created_at' => fake()->dateTimeBetween('-30 days', 'now'),
                        'updated_at' => now(),
                    ]);
                }
            }
        }

        $comments = Comment::all();
        $reactionTypes = ['like', 'dislike', 'love', 'laugh', 'angry', 'sad'];

        // Clear existing reactions to avoid duplicates
        CommentReaction::truncate();

        // Create reactions for each comment
        foreach ($comments as $comment) {
            // Randomly decide how many users will react to this comment (0-5 users)
            $reactingUsersCount = rand(0, min(5, $users->count()));
            
            if ($reactingUsersCount > 0) {
                $reactingUsers = $users->random($reactingUsersCount);
                
                foreach ($reactingUsers as $user) {
                    // Each user can only have one reaction per comment
                    CommentReaction::create([
                        'reaction_type' => $reactionTypes[array_rand($reactionTypes)],
                        'user_id' => $user->id,
                        'comment_id' => $comment->id,
                        'created_at' => fake()->dateTimeBetween($comment->created_at, 'now'),
                        'updated_at' => now(),
                    ]);
                }
            }
        }

        $this->command->info('Comment reactions seeded successfully!');
        $this->command->info('Total reactions created: ' . CommentReaction::count());
    }
}
