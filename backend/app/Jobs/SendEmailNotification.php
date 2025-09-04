<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class SendEmailNotification implements ShouldQueue
{
    use Queueable, Dispatchable, InteractsWithQueue, SerializesModels;

    public $timeout = 120;
    public $tries = 3;

    public function __construct(
        public string $email,
        public string $subject,
        public string $message,
        public string $priority = 'normal'
    ) {
        // Set queue based on priority
        $this->onQueue($priority === 'high' ? 'high-priority' : 'emails');
    }

    /**
     * Get the tags that should be assigned to the job.
     */
    public function tags(): array
    {
        return [
            'email-notification',
            'priority:' . $this->priority,
            'recipient:' . $this->email
        ];
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Log::info("Sending email notification to: {$this->email}", [
            'subject' => $this->subject,
            'priority' => $this->priority,
        ]);

        // Simulate email sending delay
        sleep(rand(2, 5));

        // Simulate occasional failure for demo purposes
        if (rand(1, 10) === 1) {
            throw new \Exception('Simulated email sending failure');
        }

        Log::info("Email sent successfully to: {$this->email}");
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error("Failed to send email to {$this->email}: " . $exception->getMessage());
    }
}
