<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DocumentContainer extends Model
{
    use HasFactory;

    protected $fillable = [
        'container_id',
        'side',
        'section_h',
        'section_v',
        'combined_section',
        'file_path',
        'status',
    ];


    public function container()
    {
    return $this->belongsTo(Container::class);
    }

}

