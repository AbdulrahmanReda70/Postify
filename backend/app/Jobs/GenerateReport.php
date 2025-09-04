<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class GenerateReport implements ShouldQueue
{
    use Queueable, Dispatchable, InteractsWithQueue, SerializesModels;

    public $timeout = 600; // 10 minutes for report generation
    public $tries = 2;

    public function __construct(
        public string $reportType,
        public array $filters = [],
        public ?int $userId = null,
        public string $format = 'pdf'
    ) {
        // Reports go to dedicated queue
        $this->onQueue('reports');
    }

    /**
     * Get the tags that should be assigned to the job.
     */
    public function tags(): array
    {
        $tags = [
            'report-generation',
            'type:' . $this->reportType,
            'format:' . $this->format,
        ];

        if ($this->userId) {
            $tags[] = 'user:' . $this->userId;
        }

        // Add tags for filters
        if (!empty($this->filters)) {
            $tags[] = 'filtered';
            foreach ($this->filters as $key => $value) {
                $tags[] = "filter:{$key}";
            }
        }

        return $tags;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Log::info("Starting report generation", [
            'type' => $this->reportType,
            'format' => $this->format,
            'filters' => $this->filters,
            'user_id' => $this->userId
        ]);

        // Simulate data collection
        $this->collectData();

        // Simulate report processing
        $this->processReport();

        // Simulate file generation
        $this->generateFile();

        Log::info("Report generation completed: {$this->reportType}");
    }

    private function collectData(): void
    {
        Log::info("Collecting data for {$this->reportType} report");
        
        // Simulate data collection time
        $collectionTime = match ($this->reportType) {
            'sales' => rand(10, 20),
            'analytics' => rand(15, 30),
            'users' => rand(5, 15),
            'inventory' => rand(8, 18),
            default => rand(10, 20)
        };

        sleep($collectionTime);
    }

    private function processReport(): void
    {
        Log::info("Processing {$this->reportType} report data");
        
        // Simulate processing time
        sleep(rand(5, 12));

        // Simulate occasional processing failure
        if (rand(1, 15) === 1) {
            throw new \Exception("Data processing failed for {$this->reportType} report");
        }
    }

    private function generateFile(): void
    {
        Log::info("Generating {$this->format} file for {$this->reportType} report");
        
        // Simulate file generation time based on format
        $generationTime = match ($this->format) {
            'pdf' => rand(8, 15),
            'excel' => rand(10, 20),
            'csv' => rand(3, 8),
            default => rand(5, 12)
        };

        sleep($generationTime);
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error("Report generation failed for {$this->reportType}: " . $exception->getMessage());
    }
}
