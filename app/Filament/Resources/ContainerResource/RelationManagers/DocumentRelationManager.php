<?php

namespace App\Filament\Resources\ContainerResource\RelationManagers;

use Filament\Forms;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\ViewField;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Filament\Forms\Get;
use Filament\Forms\Components\Placeholder;
use Illuminate\Support\HtmlString;
use Filament\Tables\Columns\BadgeColumn;


class DocumentRelationManager extends RelationManager
{
    protected static string $relationship = 'documentContainers';

    public function form(Form $form): Form
    {
        return $form->schema([
            Grid::make(12)->schema([

                Placeholder::make('side_preview')
                    ->label('Preview')
                    ->reactive()
                    ->content(function (Get $get) {
                        $side = $get('side');

                        $map = [
                            'rear'           => 'rear.png',
                            'front'          => 'front.png',
                            'right_side'     => 'right_side.png',
                            'left_side'      => 'left_side.png',
                            'roof'           => 'roof.png',
                            'floor'          => 'floor.png',
                            'understructure' => 'understructure.png',
                        ];

                        $file = $map[$side] ?? 'LOGO_GIFT.png';

                        // Fallback jika file tidak ada
                        if (! file_exists(public_path('images/sides/'.$file))) {
                        $file = 'LOGO_GIFT.png';
                        }


                        $label = $side ? ucwords(str_replace('_', ' ', $side)) : 'Pilih Side';

                        return new HtmlString(
                            '<div class="p-4 bg-gray-100 rounded text-center">
                                <img src="' . asset('images/sides/' . $file) . '" alt="Side preview" class="w-52 mx-auto rounded shadow">
                                <p class="mt-2 text-sm text-gray-600">' . e($label) . '</p>
                            </div>'
                        );
                    })
                    ->columnSpan(12),

                Select::make('side')
                    ->label('Side')
                    ->options([
                        'rear'           => 'Rear',
                        'front'          => 'Front',
                        'right_side'     => 'Right Side',
                        'left_side'      => 'Left Side',
                        'roof'           => 'Roof',
                        'floor'          => 'Floor',
                        'understructure' => 'Understructure',
                    ])
                    ->required()
                    ->live()
                    ->afterStateUpdated(function ($state, callable $set) {
                        // side berubah → kosongkan V & gabungan
                        $set('section_v', null);
                        $set('combined_section', null);
                    })
                    ->columnSpan(4),

                // Section H (opsi dinamis tergantung side)
                Select::make('section_v')
                    ->label('Section V')
                    ->options(function (Get $get) {
                        $side = $get('side');
                        $map = [
                            'rear'           => ['H' => 'H', 'T' => 'T', 'B' => 'B', 'G' => 'G'],
                            'front'          => ['H' => 'H', 'T' => 'T', 'B' => 'B', 'G' => 'G'],
                            'right_side'     => ['H' => 'H', 'T' => 'T', 'B' => 'B', 'G' => 'G'],
                            'left_side'      => ['H' => 'H', 'T' => 'T', 'B' => 'B', 'G' => 'G'],
                            'roof'           => ['L' => 'L', 'R' => 'R'],
                            'floor'          => ['L' => 'L', 'R' => 'R'],
                            'understructure' => ['L' => 'L', 'R' => 'R'],
                        ];
                        return $map[$side] ?? [];
                    })
                    ->disabled(fn (Get $get) => ! $get('side')) // nonaktif sebelum side dipilih
                    ->required()
                    ->live()
                    ->afterStateUpdated(function ($state, callable $set, callable $get) {
                        $h = $get('section_h');
                        $set('combined_section', ($h && $state) ? "{$h} - {$state}" : null);
                    })
                    ->columnSpan(4),


                Select::make('section_h')
                    ->label('Section H')
                    ->options([
                        '1' => '1',
                        '2' => '2',
                        '3' => '3',
                        '4' => '4',
                        '5' => '5',
                        '6' => '6',
                        '7' => '7',
                        '8' => '8',
                        '9' => '9',
                        '0' => '0',
                    ])
                    ->required()
                    ->live()
                    ->afterStateUpdated(function ($state, callable $set, callable $get) {
                        $v = $get('section_v');
                        $set('combined_section', ($state && $v) ? "{$state} - {$v}" : null);
                    })
                    ->columnSpan(4),


                TextInput::make('combined_section')
                    ->label('Gabungan')
                    ->disabled()
                    ->dehydrated(true)
                    ->default(function (Get $get) {
                        $h = $get('section_h');
                        $v = $get('section_v');
                        return ($v && $h) ? ($v . ' - ' . $h) : null;
                    })
                    ->columnSpan(12),

                Select::make('status')
                ->label('Status')
                ->options([
                    'Pending'    => 'Pending',
                    'Processing' => 'Processing',
                    'Approved'   => 'Approved',
                    'Rejected'   => 'Rejected',
                ])
                ->required()
                ->default('Pending')
                ->native(false)      // dropdown gaya Filament (opsional)
                ->columnSpan(4),


                FileUpload::make('file_path')
                    ->label('Foto')
                    ->image()
                    ->directory('document-containers')
                    ->imagePreviewHeight('200')
                    ->columnSpan(12),
            ]),
        ]);
    }


    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('document_name')
            ->columns([
                Tables\Columns\TextColumn::make('side')
                    ->label('Side')
                    ->formatStateUsing(fn ($state) => $state ? ucwords(str_replace('_', ' ', $state)) : '-'),

                Tables\Columns\TextColumn::make('combined_section')->label('Combined Section'),

                BadgeColumn::make('status')
                    ->label('Status')
                    ->sortable()
                    ->colors([
                        'warning' => 'Pending',
                        'info'    => 'Processing',
                        'success' => 'Approved',
                        'danger'  => 'Rejected',
                    ])
                    ->icons([
                        'heroicon-o-clock'        => 'Pending',
                        'heroicon-o-arrow-path'   => 'Processing',
                        'heroicon-o-check-badge'  => 'Approved',
                        'heroicon-o-x-circle'     => 'Rejected',
                    ])
                    ->formatStateUsing(fn ($state) => $state ?? 'Pending'),

                Tables\Columns\ImageColumn::make('file_path')->label('Photo'),
                Tables\Columns\TextColumn::make('created_at')->dateTime(),
            ])

            ->filters([
                //
            ])
            ->headerActions([
                Tables\Actions\CreateAction::make(),
                // Tables\Actions\AttachAction::make(),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                // Tables\Actions\DetachAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    // Tables\Actions\DetachBulkAction::make(),
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }
}
