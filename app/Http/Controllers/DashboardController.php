<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\Client;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $totalRevenue = Reservation::where('status', 'confirmed')->sum('total_price');
        $totalReservations = Reservation::count();
        $totalClients = Client::count();
        $activeActivities = Activity::count();

        // Reservations by status
        $statusCounts = Reservation::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get()
            ->pluck('count', 'status')
            ->toArray();

        $reservationsByStatus = [
            'pending' => $statusCounts['pending'] ?? 0,
            'confirmed' => $statusCounts['confirmed'] ?? 0,
            'cancelled' => $statusCounts['cancelled'] ?? 0,
        ];

        // Recent reservations
        $recentReservations = Reservation::with(['client', 'activity'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        // Revenue by month (for custom SVG chart)
        // Group by month/year in SQLite: strftime('%Y-%m', created_at) or similar, or just parse in PHP
        $rawRevenue = Reservation::select(
            DB::raw("strftime('%Y-%m', reservation_date) as month"),
            DB::raw("SUM(total_price) as total")
        )
        ->where('status', 'confirmed')
        ->groupBy('month')
        ->orderBy('month', 'asc')
        ->limit(6)
        ->get();

        $revenueByMonth = [];
        foreach ($rawRevenue as $rev) {
            $revenueByMonth[] = [
                'month' => $this->formatMonthName($rev->month),
                'total' => (float) $rev->total
            ];
        }

        // If empty, put default mock for visual excellence
        if (empty($revenueByMonth)) {
            $revenueByMonth = [
                ['month' => 'Ene', 'total' => 0],
                ['month' => 'Feb', 'total' => 0],
                ['month' => 'Mar', 'total' => 0],
                ['month' => 'Abr', 'total' => 0],
                ['month' => 'May', 'total' => 0],
                ['month' => 'Jun', 'total' => 0],
            ];
        }

        // Popular Activities
        $popularActivities = Activity::withCount(['reservations' => function ($q) {
            $q->where('status', 'confirmed');
        }])
        ->orderBy('reservations_count', 'desc')
        ->limit(3)
        ->get();

        return response()->json([
            'total_revenue' => $totalRevenue,
            'total_reservations' => $totalReservations,
            'total_clients' => $totalClients,
            'active_activities' => $activeActivities,
            'reservations_by_status' => $reservationsByStatus,
            'recent_reservations' => $recentReservations,
            'revenue_by_month' => $revenueByMonth,
            'popular_activities' => $popularActivities
        ]);
    }

    private function formatMonthName($yearMonth)
    {
        if (!$yearMonth) return '';
        $parts = explode('-', $yearMonth);
        if (count($parts) < 2) return $yearMonth;
        
        $monthNum = (int)$parts[1];
        $months = [
            1 => 'Ene', 2 => 'Feb', 3 => 'Mar', 4 => 'Abr', 
            5 => 'May', 6 => 'Jun', 7 => 'Jul', 8 => 'Ago', 
            9 => 'Sep', 10 => 'Oct', 11 => 'Nov', 12 => 'Dic'
        ];
        
        return $months[$monthNum] ?? $yearMonth;
    }
}
