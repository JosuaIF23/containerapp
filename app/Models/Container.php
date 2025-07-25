<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Container extends Model
{
    use HasFactory, SoftDeletes;
    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'container_code',
        'container_type',
        'container_size',
        'container_status',
        'location',
        'color',
        'last_inspection_date',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    // protected function casts(): array
    // {
    //     return [
    //         'last_inspection_date' => 'datetime',
    //     ];
    // }
}
