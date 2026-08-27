<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',
        'activity_id',
        'reservation_date',
        'status',
        'num_people',
        'total_price',
        'travel_notes',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function activity()
    {
        return $this->belongsTo(Activity::class);
    }
}
