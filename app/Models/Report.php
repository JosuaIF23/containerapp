<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Report extends Model
{
    use HasFactory, SoftDeletes;
    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'company_name',
        'status',
        'location',
        'next_inspection_at',
        'next_maintenance_at',
        'inspector_name',
        'container_id',
        'inspektor_id',
        'schedule_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'next_inspection_at' => 'datetime',
            'next_maintenance_at' => 'datetime',
        ];
    }
}
