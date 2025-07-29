<?php

namespace App\Enums;

use Filament\Support\Contracts\HasColor;
use Filament\Support\Contracts\HasIcon;
use Filament\Support\Contracts\HasLabel;

enum ReportStatus: string implements HasColor, HasIcon, HasLabel
{
    case New = 'new';           // Status baru
    case Processing = 'processing'; // Sedang diproses
    case Pending = 'pending'; // Sedang diproses
    case Approved = 'approved'; // Sudah disetujui
    case Rejected = 'rejected'; // Ditolak
    case Updated = 'updated'; // Diperbarui

    /**
     * Mengembalikan label untuk status laporan.
     */
    public function getLabel(): string
    {
        return match ($this) {
            self::New => 'New',
            self::Processing => 'Processing',
            self::Pending => 'Pending',
            self::Approved => 'Approved',
            self::Rejected => 'Rejected',
            self::Updated => 'Updated',
        };
    }

    /**
     * Mengembalikan warna yang sesuai untuk setiap status laporan.
     */
    public function getColor(): string | array | null
    {
        return match ($this) {
            self::New => 'info',
            self::Processing => 'warning',
            self::Pending => 'warning',
            self::Approved => 'success',
            self::Rejected => 'danger',
            self::Updated => 'primary',
        };
    }
    /**
     * Mengembalikan ikon yang sesuai untuk setiap status laporan.
     */
    public function getIcon(): ?string
    {
        return match ($this) {
            self::New => 'heroicon-m-sparkles',    // Ikon untuk status baru
            self::Processing => 'heroicon-m-arrow-path', // Ikon untuk dalam proses
            self::Pending => 'heroicon-m-arrow-path', // Ikon untuk dalam proses
            self::Approved => 'heroicon-m-check-badge',  // Ikon untuk disetujui
            self::Rejected => 'heroicon-m-x-circle',     // Ikon untuk ditolak
            self::Updated => 'heroicon-m-arrow-path',     // Ikon untuk diperbarui
        };
    }
}
