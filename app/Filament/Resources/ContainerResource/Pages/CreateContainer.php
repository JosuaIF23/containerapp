<?php

namespace App\Filament\Resources\ContainerResource\Pages;

use App\Filament\Resources\ContainerResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;

class CreateContainer extends CreateRecord
{
    protected static string $resource = ContainerResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        $data['location'] = $data['survey_location'];

        return $data;
    }
}
