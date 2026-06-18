<?php

namespace App\Filament\Resources;

use App\Enums\ReportStatus;
use App\Filament\Resources\ContainerResource\Pages;
use App\Filament\Resources\ContainerResource\RelationManagers\DocumentRelationManager;
use App\Models\Container;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\BadgeColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class ContainerResource extends Resource
{
    protected static ?string $model = Container::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form->schema([
            Grid::make(12)->schema([
                static::customerSurveyDetailsSection(),
                static::containerDetailsSection(),
            ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('customer')
                    ->label('Customer')
                    ->limit(20)
                    ->tooltip(fn ($state) => $state)
                    ->searchable()
                    ->sortable(),

                TextColumn::make('container_number')
                    ->label('Container Nbrs')
                    ->limit(10)
                    ->tooltip(fn ($state) => $state)
                    ->searchable()
                    ->sortable(),

                TextColumn::make('size')
                    ->label('Size')
                    ->limit(10)
                    ->tooltip(fn ($state) => $state)
                    ->searchable()
                    ->sortable(),

                BadgeColumn::make('doc_status')
                    ->label('Status')
                    ->state(fn (Container $record) => $record->documentContainers()
                        ->latest('created_at')
                        ->value('status') ?? 'Unknown')
                    ->formatStateUsing(fn (string $state) => ucfirst($state))
                    ->colors([
                        'success' => 'Approved',
                        'warning' => 'Processing',
                        'gray' => 'Pending',
                        'danger' => 'Rejected',
                        'secondary' => 'Unknown',
                    ])
                    ->icons([
                        'heroicon-m-check-badge' => 'Approved',
                        'heroicon-m-arrow-path' => 'Processing',
                        'heroicon-m-clock' => 'Pending',
                        'heroicon-m-x-circle' => 'Rejected',
                        'heroicon-m-question-mark-circle' => 'Unknown',
                    ])
                    ->sortable(false),

                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('progress')
                    ->options([
                        ReportStatus::New->value => 'New',
                        ReportStatus::Processing->value => 'Processing',
                        ReportStatus::Approved->value => 'Approved',
                        ReportStatus::Rejected->value => 'Rejected',
                        ReportStatus::Updated->value => 'Updated',
                    ]),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
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
            DocumentRelationManager::class,
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

    protected static function customerSurveyDetailsSection(): Section
    {
        return Section::make('Customer and Survey Details')
            ->schema([
                TextInput::make('customer')
                    ->label('Customer / Client')
                    ->required()
                    ->maxLength(255),

                Select::make('type_survey')
                    ->label('Type of Survey')
                    ->options([
                        'In-serv' => 'In-serv',
                        'ONH' => 'ONH',
                        'OFH' => 'OFH',
                        'Sale' => 'Sale',
                    ])
                    ->required(),

                Select::make('status')
                    ->label('Status')
                    ->options([
                        'Mty' => 'Mty',
                        'Full' => 'Full',
                    ])
                    ->required(),

                Select::make('condition')
                    ->label('Condition')
                    ->options([
                        'DMG' => 'DMG',
                        'AVL' => 'AVL',
                        'AR' => 'AR',
                    ])
                    ->required(),

                Select::make('cleanliness')
                    ->label('Cleanliness')
                    ->options([
                        'dty' => 'dty',
                        'ctm' => 'ctm',
                    ])
                    ->required(),

                TextInput::make('survey_location')
                    ->label('Survey location')
                    ->required()
                    ->maxLength(255),

                DateTimePicker::make('date_survey')
                    ->label('Date of Survey')
                    ->required(),
            ])
            ->columns(1)
            ->columnSpan(['default' => 12, 'md' => 6]);
    }

    protected static function containerDetailsSection(): Section
    {
        return Section::make('Container Details')
            ->schema([
                TextInput::make('container_number')
                    ->label('Container Nbrs')
                    ->required()
                    ->unique(ignoreRecord: true)
                    ->maxLength(255)
                    ->columnSpan(2),

                TextInput::make('size')
                    ->label('Size')
                    ->required()
                    ->numeric(),

                DateTimePicker::make('date_manufactured')
                    ->label('Date Mnf')
                    ->required(),

                TextInput::make('type')
                    ->label('Type')
                    ->required()
                    ->unique(ignoreRecord: true),

                TextInput::make('csc')
                    ->label('CSC')
                    ->required(),

                TextInput::make('mgm')
                    ->label('MGW')
                    ->required(),

                TextInput::make('acep')
                    ->label('ACEP')
                    ->required(),

                TextInput::make('payload')
                    ->label('Payload')
                    ->required()
                    ->numeric(),

                TextInput::make('tct')
                    ->label('TCT')
                    ->required(),

                TextInput::make('tare')
                    ->label('Tare')
                    ->required()
                    ->numeric(),

                TextInput::make('cu_cap')
                    ->label('Cu-Cap')
                    ->required()
                    ->numeric(),

                TextInput::make('surveyor')
                    ->label('Surveyor')
                    ->maxLength(255)
                    ->columnStart(1),
            ])
            ->columns(2)
            ->columnSpan(['default' => 12, 'md' => 6]);
    }
}
