<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable(['name', 'email', 'password'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function profile() { return $this->hasOne(Profile::class); }
    public function swipes() { return $this->hasMany(Swipe::class, 'swiper_id'); }
    public function sentMessages() { return $this->hasMany(Message::class, 'sender_id'); }
    public function projects() { return $this->hasMany(Project::class, 'creator_id'); }
    public function appNotifications() { return $this->hasMany(AppNotification::class)->orderByDesc('created_at'); }

    public function matches()
    {
        return UserMatch::where('user_a_id', $this->id)->orWhere('user_b_id', $this->id);
    }
}
