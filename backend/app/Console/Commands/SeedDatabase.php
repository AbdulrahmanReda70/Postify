<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;

class SeedDatabase extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cms:fresh {--seed : Run seeders after migration}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fresh migrate and seed the database with sample data';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🚀 Starting fresh database setup...');
        
        // Fresh migrate
        $this->info('🔄 Running fresh migration...');
        Artisan::call('migrate:fresh', ['--force' => true]);
        $this->info('✅ Migration completed');
        
        // Seed if requested
        if ($this->option('seed')) {
            $this->info('🌱 Seeding database...');
            Artisan::call('db:seed', ['--force' => true]);
            $this->info('✅ Database seeded successfully');
        }
        
        $this->info('🎉 Database setup completed!');
        $this->info('');
        $this->info('🔐 You can now login with:');
        $this->info('   👑 Admin: admin@cms.com / password');
        $this->info('   👤 User: john@example.com / password');
        
        return Command::SUCCESS;
    }
}
