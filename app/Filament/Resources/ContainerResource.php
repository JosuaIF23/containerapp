<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ContainerResource\Pages;
use App\Filament\Resources\ContainerResource\RelationManagers;
use App\Models\Container;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Group;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;

class ContainerResource extends Resource
{
    protected static ?string $model = Container::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form->schema([
            Group::make()->schema([
                Section::make('Customer and Survey Details')->schema([
                    TextInput::make('customer')
                        ->required()
                        ->maxLength(255),
                    Select::make('type_survey')
                        ->options([
                            'In-serv' => 'In-serv',
                            'ONH' => 'ONH',
                            'OFH' => 'OFH',
                            'Sale' => 'Sale',
                        ])
                        ->required(),
                    Select::make('status')
                        ->options([
                            'Mty' => 'Mty',
                            'Full' => 'Full',
                        ])
                        ->required(),
                    Select::make('condition')
                        ->options([
                            'DMG' => 'DMG',
                            'AVL' => 'AVL',
                            'AR' => 'AR',
                        ])
                        ->required(),
                    Select::make('cleanliness')
                        ->options([
                            'dty' => 'dty',
                            'ctm' => 'ctm',
                        ])
                        ->required(),
                    TextInput::make('location')
                        ->required()
                        ->maxLength(255),
                    TextInput::make('survey_location')
                        ->required()
                        ->maxLength(255),
                    DateTimePicker::make('date_survey')
                        ->required(),
                ]),

                Section::make('Container Details')->schema([
                    TextInput::make('container_number')
                        ->required()
                        // [FIX] Mengubah unique() agar tidak error saat edit
                        ->unique(ignoreRecord: true)
                        ->maxLength(255),
                    TextInput::make('size')
                        ->required()
                        ->numeric(),
                    TextInput::make('type')
                        ->required()
                        ->unique(ignoreRecord: true),
                    TextInput::make('mgm')
                        ->required(),
                    TextInput::make('payload')
                        ->required()
                        ->numeric(),
                    TextInput::make('tare')
                        ->required()
                        ->numeric(),
                    TextInput::make('cu_cap')
                        ->required()
                        ->numeric(),
                    DateTimePicker::make('date_manufactured')
                        ->required(),
                    TextInput::make('csc')
                        ->required(),
                    TextInput::make('acep')
                        ->required(),
                    TextInput::make('tct')
                        ->required(),
                ]),
            ])
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
    
            TextColumn::make('company_name')->limit(10)->tooltip(fn($state) => $state)->searchable()->sortable(),
            TextColumn::make('location')->limit(10)->tooltip(fn($state) => $state)->searchable()->sortable(),
            TextColumn::make('laboratorium')->limit(10)->tooltip(fn($state) => $state)->searchable()->sortable(),
            
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListContainers::route('/'),
            'create' => Pages\CreateContainer::route('/create'),
            'edit' => Pages\EditContainer::route('/{record}/edit'),
        ];
    }
}
