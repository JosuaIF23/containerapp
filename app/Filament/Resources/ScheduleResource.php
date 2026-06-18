<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ScheduleResource\Pages;
use App\Filament\Resources\ScheduleResource\RelationManagers;
use App\Models\Schedule;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Event;
use Filament\Forms\Components\FileUpload;

class ScheduleResource extends Resource
{
    protected static ?string $model = Schedule::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make()
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->required()
                            ->maxLength(255)
                            ->columnSpan(2),

                        Forms\Components\ColorPicker::make('colorId')
                            ->required()
                            ->columnSpan(2),

                        Forms\Components\Select::make('users')
                            // ->relationship('users', 'name')
                            ->multiple()
                            ->label('Access')
                            ->disabled(),
                            // ->default(fn() => self::getDefaultAccess()),

                        Forms\Components\Select::make('auditor_ids')
                            // ->relationship('auditor', 'name')
                            ->multiple()
                            ->live()
                            ->afterStateUpdated(fn($state, callable $set) => self::updateAccessField($state, $set)),

                        FileUpload::make('file')
                            ->label('Documentation')
                            ->columnSpan(2),
                    ])
                    ->columns(2)
                    ->columnSpan(['lg' => 2]),

                Forms\Components\Group::make()
                    ->schema([
                        Forms\Components\Section::make('Audit Schedule (Sync with Calendar)')
                            ->schema([
                                Forms\Components\DateTimePicker::make('startDateTime')
                                    ->label('Start')
                                    ->required(),
                                Forms\Components\DateTimePicker::make('endDateTime')
                                    ->label('End')
                                    ->required(),
                            ])->disabled(false),

                        Forms\Components\Section::make("Audit Day's")
                            ->schema([
                                Forms\Components\DateTimePicker::make('startDateAudit')
                                    ->label('Start')
                                    ->required()
                                    ->default(fn($get) => $get('startDateTime'))
                                    ->minDate(fn($get) => $get('startDateTime'))
                                    ->maxDate(fn($get) => $get('endDateTime')),

                                Forms\Components\DateTimePicker::make('endDateAudit')
                                    ->label('End')
                                    ->required()
                                    ->default(fn($get) => $get('endDateTime'))
                                    ->minDate(fn($get) => $get('startDateTime'))
                                    ->maxDate(fn($get) => $get('endDateTime')),
                            ]),
                    ])
                    ->columnSpan(['lg' => 1])
            ])
            ->columns(3);
    }

    // private static function updateAccessField($auditorIds, callable $set)
    // {
    //     $user = Auth::user();
    //     $auditorUsers = is_array($auditorIds) ? User::whereIn('id', $auditorIds)->pluck('id')->toArray() : [];

    //     $roleUsers = User::whereHas('roles', function ($query) {
    //         $query->whereIn('name', ['Teknis', 'Admin']);
    //     })->pluck('id')->toArray();

    //     $accessUsers = array_unique(array_merge($auditorUsers, $roleUsers, [$user->id]));

    //     $set('users', $accessUsers);
    // }

    // protected static function getDefaultAccess(): array
    // {
    //     $user = Auth::user();
    //     $roleUsers = User::whereHas('roles', function ($query) {
    //         $query->whereIn('name', ['Teknis', 'Admin']);
    //     })->pluck('id')->toArray();

    //     $eventId = request()->route('record');
    //     $auditorUsers = $eventId ? Schedule::find($eventId)?->auditor()->pluck('users.id')->toArray() ?? [] : [];

    //     $creatorUser = $eventId ? Schedule::find($eventId)?->created_by : $user->id;

    //     return array_unique(array_merge($roleUsers, $auditorUsers, [$user->id, $creatorUser]));
    // }

    // public static function mutateRelationshipDataBeforeCreate(array $data): array
    // {
    //     $data['users'] = self::getDefaultAccess();
    //     return $data;
    // }

    // public static function mutateRelationshipDataBeforeSave(array $data): array
    // {
    //     $data['users'] = self::getDefaultAccess();
    //     return $data;
    // }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')->searchable(),
                // Tables\Columns\TextColumn::make('colorId')->searchable(),
                Tables\Columns\TextColumn::make('startDateTime')
                    ->date('d F Y')
                    ->sortable(),
                Tables\Columns\TextColumn::make('endDateTime')
                    ->date('d F Y')
                    ->sortable(),
                Tables\Columns\TextColumn::make('created_at')->dateTime()->sortable()->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('updated_at')->dateTime()->sortable()->toggleable(isToggledHiddenByDefault: true),
                // Tambahkan kolom sesuai kebutuhan
            ])
            ->filters([
                // Tambahkan filter jika diperlukan
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
            // Tambahkan relation manager jika ada
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListSchedule::route('/'),
            'create' => Pages\CreateSchedule::route('/create'),
            'edit' => Pages\EditSchedule::route('/{record}/edit'),
        ];
    }
}
