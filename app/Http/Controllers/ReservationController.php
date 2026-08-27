<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ReservationController extends Controller
{
    public function index(Request $request)
    {
        $query = Reservation::with(['client', 'activity']);

        if ($request->has('status') && $request->input('status') !== 'all') {
            $query->where('status', $request->input('status'));
        }

        if ($request->has('client_id')) {
            $query->where('client_id', $request->input('client_id'));
        }

        if ($request->has('activity_id')) {
            $query->where('activity_id', $request->input('activity_id'));
        }

        return response()->json($query->orderBy('reservation_date', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'activity_id' => 'required|exists:activities,id',
            'reservation_date' => 'required|date|after_or_equal:today',
            'num_people' => 'required|integer|min:1',
            'status' => 'required|string|in:pending,confirmed,cancelled',
            'travel_notes' => 'nullable|string',
        ]);

        $activity = Activity::findOrFail($validated['activity_id']);

        // Check capacity for the activity on the given date (excluding cancelled ones)
        if ($validated['status'] !== 'cancelled') {
            $currentBooked = Reservation::where('activity_id', $validated['activity_id'])
                ->where('reservation_date', $validated['reservation_date'])
                ->where('status', '!=', 'cancelled')
                ->sum('num_people');

            $availableCapacity = $activity->max_capacity - $currentBooked;

            if ($validated['num_people'] > $availableCapacity) {
                throw ValidationException::withMessages([
                    'num_people' => ["No hay cupos suficientes para esta actividad en la fecha seleccionada. Cupos disponibles: {$availableCapacity} de {$activity->max_capacity}."],
                ]);
            }
        }

        // Auto-calculate total price with progressive group discount
        $basePrice = $activity->price;
        $numPeople = $validated['num_people'];
        if ($numPeople == 2) {
            $basePrice = $basePrice * 0.95;
        } elseif ($numPeople == 3) {
            $basePrice = $basePrice * 0.92;
        } elseif ($numPeople >= 4) {
            $basePrice = $basePrice * 0.88;
        }
        $validated['total_price'] = $basePrice * $numPeople;

        $reservation = Reservation::create($validated);
        return response()->json($reservation->load(['client', 'activity']), 201);
    }

    public function show(Reservation $reservation)
    {
        return response()->json($reservation->load(['client', 'activity']));
    }

    public function update(Request $request, Reservation $reservation)
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'activity_id' => 'required|exists:activities,id',
            'reservation_date' => 'required|date',
            'num_people' => 'required|integer|min:1',
            'status' => 'required|string|in:pending,confirmed,cancelled',
            'travel_notes' => 'nullable|string',
        ]);

        $activity = Activity::findOrFail($validated['activity_id']);

        // Check capacity on this date (excluding cancelled ones and excluding this reservation itself)
        if ($validated['status'] !== 'cancelled') {
            $currentBooked = Reservation::where('activity_id', $validated['activity_id'])
                ->where('reservation_date', $validated['reservation_date'])
                ->where('id', '!=', $reservation->id)
                ->where('status', '!=', 'cancelled')
                ->sum('num_people');

            $availableCapacity = $activity->max_capacity - $currentBooked;

            if ($validated['num_people'] > $availableCapacity) {
                throw ValidationException::withMessages([
                    'num_people' => ["No hay cupos suficientes para esta actividad en la fecha seleccionada. Cupos disponibles: {$availableCapacity} de {$activity->max_capacity}."],
                ]);
            }
        }

        // Auto-calculate total price with progressive group discount
        $basePrice = $activity->price;
        $numPeople = $validated['num_people'];
        if ($numPeople == 2) {
            $basePrice = $basePrice * 0.95;
        } elseif ($numPeople == 3) {
            $basePrice = $basePrice * 0.92;
        } elseif ($numPeople >= 4) {
            $basePrice = $basePrice * 0.88;
        }
        $validated['total_price'] = $basePrice * $numPeople;

        $reservation->update($validated);
        return response()->json($reservation->load(['client', 'activity']));
    }

    public function destroy(Reservation $reservation)
    {
        $reservation->delete();
        return response()->json(['message' => 'Reservation deleted successfully']);
    }
}
