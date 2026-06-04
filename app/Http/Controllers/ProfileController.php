<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Skill;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        return response()->json($request->user()->profile->load('skills'));
    }

    public function update(Request $request)
    {
        $profile = $request->user()->profile;
        $data = $request->validate([
            'role' => 'nullable|string|max:100',
            'main_skill' => 'nullable|string|max:100',
            'bio' => 'nullable|string|max:1000',
            'experience_summary' => 'nullable|string|max:1000',
            'looking_for' => 'nullable|array',
            'availability' => 'nullable|string',
            'campus' => 'nullable|string',
            'faculty' => 'nullable|string',
            'program' => 'nullable|string',
            'portfolio_links' => 'nullable|array',
            'language' => 'nullable|in:en,id',
            'skills' => 'nullable|array',
            'skills.*' => 'string',
        ]);

        $skills = $data['skills'] ?? null;
        unset($data['skills']);

        $profile->update($data);

        if ($skills !== null) {
            $skillIds = collect($skills)->map(function ($name) {
                return Skill::firstOrCreate(['name' => $name], ['category' => 'other'])->id;
            });
            $profile->skills()->sync($skillIds);
        }

        if ($request->has('name')) {
            $request->user()->update(['name' => $request->name]);
        }

        return response()->json($profile->fresh()->load('skills'));
    }

    public function uploadAvatar(Request $request)
    {
        $request->validate(['avatar' => 'required|image|max:5120']);
        $path = $request->file('avatar')->store('avatars', 'public');
        $request->user()->profile->update(['avatar_url' => '/storage/' . $path]);
        return response()->json(['avatar_url' => '/storage/' . $path]);
    }

    public function showUser(int $userId)
    {
        $user = \App\Models\User::with('profile.skills')->findOrFail($userId);
        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'profile' => $user->profile,
        ]);
    }
}
