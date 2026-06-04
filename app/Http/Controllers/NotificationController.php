<?php

namespace App\Http\Controllers;

use App\Models\AppNotification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(
            AppNotification::where('user_id', $request->user()->id)
                ->latest()
                ->paginate(30)
        );
    }

    public function markRead(Request $request, int $id)
    {
        AppNotification::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->update(['read_at' => now()]);
        return response()->json(['message' => 'Marked as read']);
    }

    public function markAllRead(Request $request)
    {
        AppNotification::where('user_id', $request->user()->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);
        return response()->json(['message' => 'All marked as read']);
    }
}
