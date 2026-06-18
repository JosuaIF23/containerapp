<x-filament-widgets::widget class="fi-container-keterangan-widget">
    <x-filament::section heading="Keterangan">
        <x-filament-panels::form
            id="container-keterangan-form"
            wire:submit="save"
        >
            {{ $this->form }}

            <div class="flex justify-end">
                <x-filament::button
                    tag="button"
                    type="submit"
                >
                    Save keterangan
                </x-filament::button>
            </div>
        </x-filament-panels::form>
    </x-filament::section>
</x-filament-widgets::widget>
