<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Comment;
use App\Models\Post;

class CommentSeeder extends Seeder
{
    public function run()
    {
        // Assuming posts exist
        $posts = Post::all();

        $posts->each(function ($post) {
            Comment::factory(5)->create([
                'user_id' => 1,
                'post_id' => $post->id
            ]);
        });
    }
}
