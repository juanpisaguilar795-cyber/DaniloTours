<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'duration_hours',
        'location',
        'max_capacity',
        'image_url',
    ];

    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }
}
