<?php

namespace App\Filament\Pages\Auth;

use Illuminate\Contracts\Support\Htmlable;

class Login extends \Filament\Pages\Auth\Login
{
    protected static string $layout = 'filament-panels::components.layout.base';

    protected static string $view = 'filament.custom.login';

    public function getHeading(): string | Htmlable
    {
        return '';
    }

    public function getTitle(): string | Htmlable
    {
        return 'Login';
    }
}
