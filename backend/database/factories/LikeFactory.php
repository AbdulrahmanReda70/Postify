<?php

namespace Database\Factories;

use App\Models\Like;
use App\Models\User;
use App\Models\Post;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Like>
 */
class LikeFactory extends Factory
{
    protected $model = Like::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'post_id' => Post::factory(),
        ];
    }

    /**
     * Create a like for an existing user and post.
     */
    public function forUserAndPost(int $userId, int $postId): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => $userId,
            'post_id' => $postId,
        ]);
    }

    /**
     * Create a like for an existing user.
     */
    public function forUser(int $userId): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => $userId,
        ]);
    }

    /**
     * Create a like for an existing post.
     */
    public function forPost(int $postId): static
    {
        return $this->state(fn (array $attributes) => [
            'post_id' => $postId,
        ]);
    }
}
