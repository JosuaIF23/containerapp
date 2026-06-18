<?php

namespace App\Filament\Resources\ContainerResource\Pages;

use App\Filament\Resources\ContainerResource;
use App\Filament\Resources\ContainerResource\Widgets\ContainerKeteranganWidget;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditContainer extends EditRecord
{
    protected static string $resource = ContainerResource::class;

    protected function mutateFormDataBeforeSave(array $data): array
    {
        $data['location'] = $data['survey_location'];

        return $data;
    }

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }

    protected function getFooterWidgets(): array
    {
        return [
            ContainerKeteranganWidget::make([
                'recordId' => $this->getRecord()->getKey(),
            ]),
        ];
    }

    public function getFooterWidgetsColumns(): int | string | array
    {
        return 1;
    }
}
