<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'username' => 'Test User',
            'password' => 'test@example.com'
        ]);
        
        // Run the seeders in order
        $this->call([
            LikeSeeder::class,
            PostSeeder::class,
            CommentSeeder::class,
        ]);
    }
}
