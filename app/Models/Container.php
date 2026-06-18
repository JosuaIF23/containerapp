<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
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
        'customer',
        'type_survey',
        'status',
        'condition',
        'cleanliness',
        'location',
        'survey_location',
        'date_survey',
        'container_number',
        'size',
        'type',
        'mgm',
        'payload',
        'tare',
        'cu_cap',
        'date_manufactured',
        'csc',
        'acep',
        'tct',
        'surveyor',
        'note',
        'schedule_id',
    ];

    public function schedule(): HasOne
    {
        return $this->hasOne(Schedule::class);
    }

    public function documentContainers()
    {
    return $this->hasMany(DocumentContainer::class);
    }


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
