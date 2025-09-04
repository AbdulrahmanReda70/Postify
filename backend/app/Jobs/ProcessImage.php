<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ProcessImage implements ShouldQueue
{
    use Queueable, Dispatchable, InteractsWithQueue, SerializesModels;

    public $timeout = 300; // 5 minutes for image processing
    public $tries = 2;

    public function __construct(
        public string $imagePath,
        public array $operations = [],
        public ?int $userId = null
    ) {
        // Image processing goes to dedicated queue
        $this->onQueue('image-processing');
    }

    /**
     * Get the tags that should be assigned to the job.
     */
    public function tags(): array
    {
        $tags = [
            'image-processing',
            'file:' . basename($this->imagePath),
        ];

        if ($this->userId) {
            $tags[] = 'user:' . $this->userId;
        }

        // Add tags for each operation
        foreach ($this->operations as $operation) {
            $tags[] = 'operation:' . $operation;
        }

        return $tags;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Log::info("Starting image processing for: {$this->imagePath}", [
            'operations' => $this->operations,
            'user_id' => $this->userId
        ]);

        // Simulate different processing operations
        foreach ($this->operations as $operation) {
            $this->processOperation($operation);
        }

        Log::info("Image processing completed for: {$this->imagePath}");
    }

    private function processOperation(string $operation): void
    {
        Log::info("Processing operation: {$operation} on {$this->imagePath}");
        
        // Simulate processing time based on operation
        $processingTime = match ($operation) {
            'resize' => rand(3, 8),
            'watermark' => rand(5, 10),
            'compress' => rand(2, 6),
            'filter' => rand(4, 9),
            default => rand(3, 7)
        };

        sleep($processingTime);

        // Simulate occasional failure for watermark operation
        if ($operation === 'watermark' && rand(1, 8) === 1) {
            throw new \Exception("Failed to apply watermark to {$this->imagePath}");
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error("Image processing failed for {$this->imagePath}: " . $exception->getMessage());
    }
}
