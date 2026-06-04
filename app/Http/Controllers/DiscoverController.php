<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Swipe;
use App\Models\UserMatch;
use App\Models\AppNotification;
use App\Events\NewMatch;
use Illuminate\Http\Request;

class DiscoverController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $swipedIds = Swipe::where('swiper_id', $user->id)->pluck('swiped_id');
        $matchedIds = UserMatch::where('user_a_id', $user->id)->pluck('user_b_id')
            ->merge(UserMatch::where('user_b_id', $user->id)->pluck('user_a_id'));

        $excluded = $swipedIds->merge($matchedIds)->push($user->id)->unique();

        $query = User::whereNotIn('id', $excluded)
            ->whereHas('profile')
            ->with('profile.skills');

        if ($request->role) {
            $query->whereHas('profile', fn($q) => $q->where('role', 'like', '%' . $request->role . '%'));
        }
        if ($request->skill) {
            $query->whereHas('profile.skills', fn($q) => $q->where('name', 'like', '%' . $request->skill . '%'));
        }
        if ($request->availability) {
            $query->whereHas('profile', fn($q) => $q->where('availability', $request->availability));
        }

        $candidates = $query->inRandomOrder()->take(20)->get()->map(function ($u) {
            return [
                'id' => $u->id,
                'name' => $u->name,
                'profile' => $u->profile,
                'skills' => $u->profile->skills,
            ];
        });

        return response()->json($candidates);
    }

    public function swipe(Request $request)
    {
        $data = $request->validate([
            'swiped_id' => 'required|exists:users,id',
            'action' => 'required|in:pass,interest,save',
        ]);

        $swipe = Swipe::updateOrCreate(
            ['swiper_id' => $request->user()->id, 'swiped_id' => $data['swiped_id']],
            ['action' => $data['action']]
        );

        $result = ['swipe' => $swipe, 'match' => null];

        if ($data['action'] === 'interest') {
            $mutual = Swipe::where('swiper_id', $data['swiped_id'])
                ->where('swiped_id', $request->user()->id)
                ->where('action', 'interest')
                ->exists();

            if ($mutual) {
                $match = UserMatch::firstOrCreate(
                    [
                        'user_a_id' => min($request->user()->id, $data['swiped_id']),
                        'user_b_id' => max($request->user()->id, $data['swiped_id']),
                    ],
                    ['match_summary' => ['Mutual interest match!']]
                );

                if ($match->wasRecentlyCreated) {
                    event(new NewMatch($match, $data['swiped_id']));

                    AppNotification::create([
                        'user_id' => $data['swiped_id'],
                        'type' => 'new_match',
                        'title' => 'New Mutualizm Match!',
                        'body' => $request->user()->name . ' matched with you!',
                        'data' => ['match_id' => $match->id],
                    ]);
                }

                $result['match'] = $match->load(['userA.profile', 'userB.profile']);
            }
        }

        return response()->json($result);
    }
}
