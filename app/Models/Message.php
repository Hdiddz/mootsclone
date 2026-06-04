<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $fillable = ['match_id', 'sender_id', 'text', 'read_at'];
    protected $casts = ['read_at' => 'datetime'];

    public function match() { return $this->belongsTo(UserMatch::class, 'match_id'); }
    public function sender() { return $this->belongsTo(User::class, 'sender_id'); }
}
