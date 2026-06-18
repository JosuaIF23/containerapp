<?php

namespace App\Filament\Widgets;

use App\Filament\Resources\ScheduleResource;
use App\Models\Schedule;
use Filament\Actions\ViewAction;
use Filament\Forms;
use Filament\Forms\Form;
use Illuminate\Database\Eloquent\Model;
use Saade\FilamentFullCalendar\Actions\CreateAction;
use Saade\FilamentFullCalendar\Actions\DeleteAction;
use Saade\FilamentFullCalendar\Actions\EditAction;
use Saade\FilamentFullCalendar\Widgets\FullCalendarWidget;

class CalendarWidget extends FullCalendarWidget
{
    public Model|string|null $model = Schedule::class;

    public function fetchEvents(array $fetchInfo): array
    {
        return Schedule::query()
            ->where('startDateTime', '>=', $fetchInfo['start'])
            ->where('endDateTime', '<=', $fetchInfo['end'])
            ->get()
            ->map(fn (Schedule $s) => [
                'id'    => $s->id,
                'title' => $s->name,
                'color' => $s->colorId,        // hex color di kolom Schedule
                'start' => $s->startDateTime,
                'end'   => $s->endDateTime,
                'url'   => ScheduleResource::getUrl('edit', ['record' => $s]),
                'shouldOpenUrlInNewTab' => false,
            ])
            ->all();
    }

    public function getFormSchema(): array
    {
        return [
            Forms\Components\TextInput::make('name')->required(),
            Forms\Components\ColorPicker::make('colorId')->required(),
            Forms\Components\Grid::make()->schema([
                Forms\Components\DateTimePicker::make('startDateTime')->required(),
                Forms\Components\DateTimePicker::make('endDateTime')->required(),
            ]),
        ];
    }

    protected function headerActions(): array
    {
        return [
            CreateAction::make()->label('Add Event'),
        ];
    }

    protected function viewAction(): \Filament\Actions\Action
    {
        return \Filament\Actions\ViewAction::make()
            ->modalFooterActions(fn (ViewAction $action) => [
                EditAction::make(),
                DeleteAction::make(),
                $action->getModalCancelAction(),
            ]);
    }

    protected function modalActions(): array
    {
        return [
            CreateAction::make(),
            EditAction::make(),
            DeleteAction::make(),
        ];
    }

    public static function canView(): bool
    {
        return true;
    }
}
