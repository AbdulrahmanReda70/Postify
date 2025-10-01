<?php

namespace App\Http\Controllers\Notifications;

use App\Http\Controllers\Controller;
use Auth;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index()
    {
        $notifications = Auth::user()->notifications;
        return response()->json($notifications, 200);
    }

    public function markAsRead($id)
    {
        $notification = Auth::user()->notifications()->where('id', $id)->first();

        if ($notification) {
            $notification->markAsRead();
            return response()->json(['message' => 'Notification marked as read'], 200);
        }

        return response()->json(['message' => 'Notification not found'], 404);
    }

    public function destroy($id)
    {
        $notification = Auth::user()->notifications()->where('id', $id)->first();
        if ($notification) {
            $notification->delete();
        }
        return response()->json(['message' => 'Notification not found'], 404);
    }

    public function unReadCount()
    {
        $count = Auth::user()->notifications()->whereNull('read_at')->count();
        return response()->json(['unreadCount' => $count]);
    }
}
