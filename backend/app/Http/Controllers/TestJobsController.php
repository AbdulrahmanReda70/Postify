<?php

namespace App\Http\Controllers;

use App\Jobs\ProcessImage;
use App\Jobs\SendEmailNotification;
use App\Jobs\SendPostEmailJob;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TestJobsController extends Controller
{
    public function dispatchImageProcessing()
    {
        // Dispatch multiple image processing jobs with different operations
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

        $jobIds = [];

        foreach ($images as $index => $imagePath) {
            $job = ProcessImage::dispatch(
                $imagePath,
                $operations[$index] ?? ['resize'],
                Auth::id()
            );

            $jobIds[] = [
                'image' => $imagePath,
                'operations' => $operations[$index] ?? ['resize']
            ];
        }

        return response()->json([
            'message' => 'Image processing jobs dispatched successfully!',
            'jobs' => $jobIds,
            'note' => 'Check Laravel Horizon to see the jobs in action'
        ]);
    }

    public function dispatchEmailNotifications()
    {
        // Dispatch multiple email notifications with different priorities
        $emails = [
            [
                'email' => 'user1@example.com',
                'subject' => 'Welcome to our platform!',
                'message' => 'Thank you for joining us.',
                'priority' => 'high'
            ],
            [
                'email' => 'user2@example.com',
                'subject' => 'Your daily digest',
                'message' => 'Here are your updates for today.',
                'priority' => 'normal'
            ],
            [
                'email' => 'user3@example.com',
                'subject' => 'Special offer just for you!',
                'message' => 'Check out our latest deals.',
                'priority' => 'normal'
            ]
        ];

        foreach ($emails as $emailData) {
            SendEmailNotification::dispatch(
                $emailData['email'],
                $emailData['subject'],
                $emailData['message'],
                $emailData['priority']
            );
        }

        return response()->json([
            'message' => 'Email notification jobs dispatched successfully!',
            'emails_sent' => count($emails),
            'note' => 'Check Laravel Horizon to see the jobs in action'
        ]);
    }

    public function dispatchMixedJobs()
    {
        // Dispatch a mix of different job types

        // 1. Image processing jobs
        ProcessImage::dispatch('uploads/profile-pic.jpg', ['resize', 'compress'], Auth::id());
        ProcessImage::dispatch('uploads/banner.jpg', ['watermark', 'filter'], Auth::id());

        // 2. Email notifications
        SendEmailNotification::dispatch(
            'admin@example.com',
            'System Alert',
            'New user registered on the platform',
            'high'
        );

        SendEmailNotification::dispatch(
            'newsletter@example.com',
            'Weekly Newsletter',
            'Your weekly update is ready',
            'normal'
        );

        // 3. Post email job (if you want to test existing post functionality)
        // Uncomment if you have a post to test with:
        // $post = \App\Models\Post::first();
        // if ($post) {
        //     SendPostEmailJob::dispatch($post);
        // }

        return response()->json([
            'message' => 'Mixed jobs dispatched successfully!',
            'jobs_dispatched' => [
                'image_processing' => 2,
                'email_notifications' => 2,
                'post_emails' => 0
            ],
            'note' => 'Check Laravel Horizon to see all jobs in different queues'
        ]);
    }

    public function dispatchDelayedJobs()
    {
        // Dispatch jobs with delays to see scheduling in action

        // Immediate job
        SendEmailNotification::dispatch(
            'immediate@example.com',
            'Immediate notification',
            'This should process right away',
            'high'
        );

        // Job delayed by 30 seconds
        SendEmailNotification::dispatch(
            'delayed30@example.com',
            'Delayed by 30 seconds',
            'This job was delayed by 30 seconds',
            'normal'
        )->delay(now()->addSeconds(30));

        // Job delayed by 1 minute
        ProcessImage::dispatch(
            'uploads/delayed-image.jpg',
            ['resize', 'watermark'],
            Auth::id()
        )->delay(now()->addMinute());

        // Job delayed by 2 minutes
        SendEmailNotification::dispatch(
            'delayed2min@example.com',
            'Delayed by 2 minutes',
            'This job was delayed by 2 minutes',
            'normal'
        )->delay(now()->addMinutes(2));

        return response()->json([
            'message' => 'Delayed jobs dispatched successfully!',
            'schedule' => [
                'immediate' => 1,
                'delayed_30s' => 1,
                'delayed_1min' => 1,
                'delayed_2min' => 1
            ],
            'note' => 'Check Laravel Horizon to see scheduled jobs and their execution times'
        ]);
    }
}
