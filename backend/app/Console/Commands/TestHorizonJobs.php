<?php

namespace App\Console\Commands;

use App\Jobs\ProcessImage;
use App\Jobs\SendEmailNotification;
use Illuminate\Console\Command;

class TestHorizonJobs extends Command
{
    protected $signature = 'horizon:test-jobs {type=mixed : Type of jobs to dispatch (image|email|mixed|delayed)}';
    protected $description = 'Dispatch test jobs to see Horizon in action';

    public function handle()
    {
        $type = $this->argument('type');

        $this->info("🚀 Dispatching {$type} jobs for Horizon testing...");

        switch ($type) {
            case 'image':
                $this->dispatchImageJobs();
                break;
            case 'email':
                $this->dispatchEmailJobs();
                break;
            case 'delayed':
                $this->dispatchDelayedJobs();
                break;
            case 'mixed':
            default:
                $this->dispatchMixedJobs();
                break;
        }

        $this->info("✅ Jobs dispatched! Check Laravel Horizon dashboard to see them in action.");
        $this->line("🌐 Horizon URL: " . config('app.url') . '/horizon');
    }

    private function dispatchImageJobs()
    {
        $this->info("📸 Dispatching image processing jobs...");

        $images = [
            'uploads/test-image-1.jpg',
            'uploads/test-image-2.jpg',
            'uploads/test-image-3.jpg'
        ];

        $operations = [
            ['resize', 'compress'],
            ['watermark', 'filter'],
            ['resize', 'watermark', 'compress']
        ];

        foreach ($images as $index => $imagePath) {
            ProcessImage::dispatch(
                $imagePath,
                $operations[$index] ?? ['resize'],
                1 // Mock user ID
            );
            $this->line("  • {$imagePath} -> " . implode(', ', $operations[$index] ?? ['resize']));
        }
    }

    private function dispatchEmailJobs()
    {
        $this->info("📧 Dispatching email notification jobs...");

        $emails = [
            ['email' => 'user1@example.com', 'subject' => 'Welcome!', 'priority' => 'high'],
            ['email' => 'user2@example.com', 'subject' => 'Daily Digest', 'priority' => 'normal'],
            ['email' => 'user3@example.com', 'subject' => 'Special Offer', 'priority' => 'normal'],
        ];

        foreach ($emails as $emailData) {
            SendEmailNotification::dispatch(
                $emailData['email'],
                $emailData['subject'],
                'This is a test email notification.',
                $emailData['priority']
            );
            $this->line("  • {$emailData['email']} ({$emailData['priority']} priority)");
        }
    }

    private function dispatchDelayedJobs()
    {
        $this->info("⏰ Dispatching delayed jobs...");

        // Immediate
        SendEmailNotification::dispatch(
            'immediate@example.com',
            'Immediate notification',
            'This processes right away',
            'high'
        );
        $this->line("  • Immediate email");

        // 30 seconds delay
        SendEmailNotification::dispatch(
            'delayed30@example.com',
            'Delayed 30s',
            'This was delayed by 30 seconds',
            'normal'
        )->delay(now()->addSeconds(30));
        $this->line("  • Email delayed by 30 seconds");

        // 1 minute delay
        ProcessImage::dispatch(
            'uploads/delayed-image.jpg',
            ['resize', 'watermark'],
            1
        )->delay(now()->addMinute());
        $this->line("  • Image processing delayed by 1 minute");

        // 2 minutes delay
        SendEmailNotification::dispatch(
            'delayed2min@example.com',
            'Delayed 2min',
            'This was delayed by 2 minutes',
            'normal'
        )->delay(now()->addMinutes(2));
        $this->line("  • Email delayed by 2 minutes");
    }

    private function dispatchMixedJobs()
    {
        $this->info("🔄 Dispatching mixed jobs...");

        // Image processing
        ProcessImage::dispatch('uploads/profile-pic.jpg', ['resize', 'compress'], 1);
        $this->line("  • Image: profile-pic.jpg");

        // High priority email
        SendEmailNotification::dispatch(
            'admin@example.com',
            'System Alert',
            'New activity detected',
            'high'
        );
        $this->line("  • High priority email to admin");

        // Normal email
        SendEmailNotification::dispatch(
            'newsletter@example.com',
            'Weekly Newsletter',
            'Your weekly update',
            'normal'
        );
        $this->line("  • Normal priority newsletter");

        // Another image with watermark
        ProcessImage::dispatch('uploads/banner.jpg', ['watermark', 'filter'], 1);
        $this->line("  • Image: banner.jpg with watermark");
    }
}
