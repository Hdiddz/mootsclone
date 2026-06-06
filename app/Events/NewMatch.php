<?php

namespace App\Events;

use App\Models\UserMatch;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Queue\SerializesModels;

class NewMatch implements ShouldBroadcastNow
{
    use SerializesModels;

    public function __construct(public UserMatch $match, public int $recipientId) {}

    public function broadcastOn(): array
    {
        return [new PrivateChannel('user.' . $this->recipientId)];
    }

    public function broadcastWith(): array
    {
        return [
            'match_id' => $this->match->id,
            'user_a_id' => $this->match->user_a_id,
            'user_b_id' => $this->match->user_b_id,
        ];
    }
}
