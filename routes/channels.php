<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('chat.{matchId}', function ($user, $matchId) {
    $match = \App\Models\UserMatch::find($matchId);
    return $match && ($match->user_a_id === $user->id || $match->user_b_id === $user->id);
});

Broadcast::channel('user.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId;
});
