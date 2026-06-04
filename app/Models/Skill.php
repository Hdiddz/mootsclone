<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Skill extends Model
{
    protected $fillable = ['name', 'category'];
    public function profiles() { return $this->belongsToMany(Profile::class, 'profile_skills')->withPivot('level'); }
}
