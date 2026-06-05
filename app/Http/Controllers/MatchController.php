<?php

namespace App\Http\Controllers;

use App\Models\UserMatch;
use Illuminate\Http\Request;

class MatchController extends Controller
{
    public function index(Request $request)
    {
        $userId = $request->user()->id;
        $matches = UserMatch::where('user_a_id', $userId)
            ->orWhere('user_b_id', $userId)
            ->with(['userA.profile.skills', 'userB.profile.skills'])
            ->latest()
            ->get()
            ->map(function ($match) use ($userId) {
                $partner = $match->user_a_id === $userId ? $match->userB : $match->userA;
                $lastMessage = $match->messages()->latest()->first();
                return [
                    'id' => $match->id,
                    'partner' => [
                        'id' => $partner->id,
                        'name' => $partner->name,
                        'profile' => $partner->profile,
                    ],
                    'match_summary' => $match->match_summary,
                    'last_message' => $lastMessage,
                    'created_at' => $match->created_at,
                ];
            });

        return response()->json($matches);
    }

    public function destroy(Request $request, int $matchId)
    {
        $userId = $request->user()->id;
        $match = UserMatch::findOrFail($matchId);

        abort_unless(
            $match->user_a_id === $userId || $match->user_b_id === $userId,
            403, 'Not a participant'
        );

        $match->delete();

        return response()->noContent();
    }
}
