<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserMatch extends Model
{
    protected $table = 'matches';
    protected $fillable = ['user_a_id', 'user_b_id', 'match_summary'];
    protected $casts = ['match_summary' => 'array'];

    public function userA() { return $this->belongsTo(User::class, 'user_a_id'); }
    public function userB() { return $this->belongsTo(User::class, 'user_b_id'); }
    public function messages() { return $this->hasMany(Message::class, 'match_id')->orderBy('created_at'); }

    public function getPartner(int $userId): User
    {
        return $this->user_a_id === $userId ? $this->userB : $this->userA;
    }
}
