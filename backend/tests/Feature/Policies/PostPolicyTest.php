<?php

use Tests\TestCase;
use App\Models\{Post, User};
use Illuminate\Foundation\Testing\RefreshDatabase;

class PostTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_edit_his_post()
    {
        $user = User::factory()->create();
        $post = Post::factory()->for($user)->create();
        $payload = [
            'title' => 'Updated',
            'body' => 'This is a valid new content body that exceeds twenty chars.',
        ];

        $this
            ->actingAs($user, 'sanctum')
            ->patchJson('/api/posts/' . $post->id, $payload)
            ->assertStatus(200);

        $this->assertDatabaseHas('posts', [
            'id' => $post->id,
            'title' => $payload['title'],
            'body' => $payload['body'],
        ]);
    }

    public function test_user_can_not_edit_other_users_posts()
    {
        $author = User::factory()->create();
        $user = User::factory()->create();
        $post = Post::factory()->for($author)->create();
        $payload = [
            'title' => 'Updated',
            'body' => 'This is a valid new content body that exceeds twenty chars.',
        ];

        $this
            ->actingAs($user, 'sanctum')
            ->patchJson('/api/posts/' . $post->id, $payload)
            ->assertStatus(403);
    }
}
