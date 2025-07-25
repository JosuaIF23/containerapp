<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Schedule extends Model
{
    use HasFactory, SoftDeletes;
    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'google_calendar_event_id',
        'name',
        'description',
        'colorId',
        'startDateTime',
        'endDateTime',
        'attendees',
        'startDateAudit',
        'endDateAudit',
    ];
}
