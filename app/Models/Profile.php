<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Profile extends Model
{
    protected $guarded = ['id'];
    protected $casts = [
        'looking_for' => 'array',
        'portfolio_links' => 'array',
    ];

    public function user(): BelongsTo { return $this->belongsTo(User::class); }
    public function skills(): BelongsToMany { return $this->belongsToMany(Skill::class, 'profile_skills')->withPivot('level'); }
}
