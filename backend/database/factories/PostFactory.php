<?php

namespace Database\Factories;

use App\Models\Post;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Post>
 */
class PostFactory extends Factory
{
    protected $model = Post::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {

        return [

            'user_id' => $this->faker->numberBetween(1, 1000),
            'title' => $this->faker->title,
            'body' => $this->faker->title,
            'image' => 'posts/e1bIXNMK1TdwaWqsR9Av9aU1db99P2KpFHJ4n6lt.jpg',
            'created_at' => '2025-04-01 21:21:04',
            'updated_at' => $this->faker->time,
        ];
    }
}
