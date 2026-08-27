<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use Illuminate\Http\Request;

class ActivityController extends Controller
{
    public function index()
    {
        return response()->json(Activity::orderBy('name')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'duration_hours' => 'required|integer|min:1',
            'location' => 'required|string|max:255',
            'max_capacity' => 'required|integer|min:1',
            'image_url' => 'required|url',
        ]);

        $activity = Activity::create($validated);
        return response()->json($activity, 201);
    }

    public function show(Activity $activity)
    {
        return response()->json($activity->load('reservations.client'));
    }

    public function update(Request $request, Activity $activity)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'duration_hours' => 'required|integer|min:1',
            'location' => 'required|string|max:255',
            'max_capacity' => 'required|integer|min:1',
            'image_url' => 'required|url',
        ]);

        $activity->update($validated);
        return response()->json($activity);
    }

    public function destroy(Activity $activity)
    {
        $activity->delete();
        return response()->json(['message' => 'Activity deleted successfully']);
    }
}
