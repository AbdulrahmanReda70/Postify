<?php
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('guest cannot access user endpoint', function () {
    // Arrange
    $user = User::factory()->create();

    // Act
    $response = $this->actingAs($user, 'sanctum')
        ->getJson('/api/users/1');

    // Assert
    $response->assertStatus(200);
});
