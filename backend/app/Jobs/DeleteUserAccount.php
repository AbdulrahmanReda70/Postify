<?php

namespace App\Jobs;

use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class DeleteUserAccount implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(
        private User $user
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // Delete all tokens for the user
        $this->user->tokens()->delete();
        
        // Delete the user account
        $this->user->delete();
    }
}
