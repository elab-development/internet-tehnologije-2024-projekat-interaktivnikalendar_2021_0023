<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Foundation\Http\Kernel;
use Illuminate\Http\Middleware\HandleCors;

class CorsServiceProvider extends ServiceProvider
{
    public function register(): void {}

    public function boot(): void
    {
        $this->app->booted(function () {
            $kernel = $this->app->make(Kernel::class);
            $kernel->prependMiddleware(HandleCors::class);
        });
    }
}
