<?php

namespace App\Notifications;

use Auth;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

class WelcomeMessageNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(protected $message) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['broadcast', 'database'];
    }

    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage([
            'message' => $this->message,
            'time' => now()->toDateTimeString(),
        ]);
    }

    // channel the event should broadcast on
    public function broadcastOn()
    {
        // Private channel - only the authenticated user can listen
        // Do not include the 'private-' prefix here; the PrivateChannel class adds it for transport.
        return new PrivateChannel('user.' . Auth::id()); // channel name

        // Public channel example:
        // Anyone can listen to this channel without authentication
        // return new Channel('notifications'); // public channel - no auth required
        // return new Channel('global-announcements'); // another public channel example
    }

    // The event name to broadcast
    public function broadcastAs()
    {
        return 'WelcomeNotification'; // event name use it in frontend to listen to it
    }

    /**
     * Get the array representation of the notification.
     * this for database channel if you want to store the notification in database
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
