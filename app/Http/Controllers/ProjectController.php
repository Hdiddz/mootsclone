<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index()
    {
        return response()->json(
            Project::with('creator:id,name', 'members:id,name')
                ->latest()
                ->paginate(20)
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'summary' => 'nullable|string|max:2000',
            'status' => 'nullable|string',
            'deadline' => 'nullable|date',
            'needed_roles' => 'nullable|array',
            'skills_needed' => 'nullable|array',
        ]);

        $project = Project::create(array_merge($data, ['creator_id' => $request->user()->id]));
        $project->members()->attach($request->user()->id, ['role' => 'creator']);

        return response()->json($project->load('creator:id,name', 'members:id,name'), 201);
    }

    public function show(int $id)
    {
        return response()->json(
            Project::with('creator:id,name', 'members:id,name')->findOrFail($id)
        );
    }

    public function join(Request $request, int $id)
    {
        $project = Project::findOrFail($id);
        $project->members()->syncWithoutDetaching([
            $request->user()->id => ['role' => $request->role ?? 'member']
        ]);
        return response()->json(['message' => 'Joined project']);
    }
}
