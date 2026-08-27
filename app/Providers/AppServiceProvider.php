<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        if ($this->app->environment('production') || file_exists('/var/task')) {
            \Illuminate\Support\Facades\URL::forceScheme('https');
        }

        // Dynamically run SQLite in-memory database migrations and seeders on Vercel
        if (file_exists('/var/task')) {
            $this->setupVercelDatabase();
        }
    }

    protected function setupVercelDatabase()
    {
        try {
            // Set connection configuration dynamically to sqlite :memory:
            config([
                'database.default' => 'sqlite',
                'database.connections.sqlite' => [
                    'driver' => 'sqlite',
                    'database' => ':memory:',
                    'prefix' => '',
                    'foreign_key_constraints' => true,
                ]
            ]);

            // Re-connect to database
            \Illuminate\Support\Facades\DB::purge('sqlite');
            \Illuminate\Support\Facades\DB::reconnect('sqlite');

            // Run migrations and seeders if the users table doesn't exist in memory
            if (!\Illuminate\Support\Facades\Schema::hasTable('users')) {
                \Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
                \Illuminate\Support\Facades\Artisan::call('db:seed', ['--force' => true]);
            }
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Vercel DB Setup Error: ' . $e->getMessage());
        }
    }
}
