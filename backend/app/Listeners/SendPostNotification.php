<?php

namespace App\Listeners;

use App\Events\PostPublished;
use App\Jobs\SendPostEmailJob;
use Clockwork\Support\Doctrine\Legacy\Logger;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendPostNotification
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(PostPublished $event): void
    {
        dispatch(new SendPostEmailJob($event->post));
    }
}
