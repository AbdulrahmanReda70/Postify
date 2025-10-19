<?php

namespace App\Notifications;

use Illuminate\Broadcasting\Channel;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class Ads extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(private $message)
    {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database', 'broadcast'];
    }

    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage([
            'message' => $this->message,
            'time' => now()->toDateTimeString(),
            'read_at' => null
        ]);
    }

    // channel the event should broadcast on
    public function broadcastOn()
    {
        // Private channel - only the authenticated user can listen
        // Do not include the 'private-' prefix here; the PrivateChannel class adds it for transport.
        return new Channel('offers'); // channel name

        // Public channel example:
        // Anyone can listen to this channel without authentication
        // return new Channel('notifications'); // public channel - no auth required
        // return new Channel('global-announcements'); // another public channel example
    }

    // The event name to broadcast (this for the frontend)
    public function broadcastAs()
    {
        return 'UserNotification'; // event name use it in frontend to listen to it
    }


    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'message' => $this->message,
            'time'    => now()->toDateTimeString(),
        ];
    }
}
