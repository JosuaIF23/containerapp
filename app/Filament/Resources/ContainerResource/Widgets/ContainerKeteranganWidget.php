<?php

namespace App\Filament\Resources\ContainerResource\Widgets;

use App\Models\Container;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Widgets\Widget;

class ContainerKeteranganWidget extends Widget implements HasForms
{
    use InteractsWithForms;

    protected static bool $isLazy = false;

    protected static string $view = 'filament.resources.container-resource.widgets.container-keterangan-widget';

    protected int | string | array $columnSpan = 'full';

    public ?array $data = [];

    public int $recordId;

    public function mount(int $recordId): void
    {
        $this->recordId = $recordId;

        $this->form->fill([
            'note' => $this->container()->note,
        ]);
    }

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Textarea::make('note')
                    ->hiddenLabel()
                    ->placeholder('Tulis keterangan di sini...')
                    ->rows(6)
                    ->autosize(),
            ])
            ->statePath('data');
    }

    public function save(): void
    {
        $data = $this->form->getState();

        $this->container()->update([
            'note' => $data['note'] ?? null,
        ]);

        Notification::make()
            ->success()
            ->title('Keterangan berhasil disimpan')
            ->send();
    }

    protected function container(): Container
    {
        return Container::query()->findOrFail($this->recordId);
    }
}
