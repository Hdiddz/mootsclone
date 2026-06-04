<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $guarded = ['id'];
    protected $casts = ['needed_roles' => 'array', 'skills_needed' => 'array'];

    public function creator() { return $this->belongsTo(User::class, 'creator_id'); }
    public function members() { return $this->belongsToMany(User::class, 'project_members')->withPivot('role')->withTimestamps(); }
}
