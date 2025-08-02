<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Post;

class PostSeeder extends Seeder
{
    public function run()
    {
        // Create 10 posts with user_id 1
        Post::factory(10)->create(['user_id' => 1]);
    }
}
