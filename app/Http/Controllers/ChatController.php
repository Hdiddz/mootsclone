<?php

namespace App\Http\Controllers;

use App\Models\UserMatch;
use App\Models\Message;
use App\Events\MessageSent;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function messages(Request $request, int $matchId)
    {
        $match = UserMatch::findOrFail($matchId);
        $userId = $request->user()->id;

        abort_unless(
            $match->user_a_id === $userId || $match->user_b_id === $userId,
            403, 'Not a participant'
        );

        Message::where('match_id', $matchId)
            ->where('sender_id', '!=', $userId)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json(
            $match->messages()->with('sender:id,name')->get()
        );
    }

    public function send(Request $request, int $matchId)
    {
        $match = UserMatch::findOrFail($matchId);
        $userId = $request->user()->id;

        abort_unless(
            $match->user_a_id === $userId || $match->user_b_id === $userId,
            403, 'Not a participant'
        );

        $data = $request->validate(['text' => 'required|string|max:5000']);

        $message = Message::create([
            'match_id' => $matchId,
            'sender_id' => $userId,
            'text' => $data['text'],
        ]);

        broadcast(new MessageSent($message->load('sender:id,name')))->toOthers();

        return response()->json($message->load('sender:id,name'), 201);
    }
}
