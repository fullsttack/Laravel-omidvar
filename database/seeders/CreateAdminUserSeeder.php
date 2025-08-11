<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class CreateAdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $mobile = '09129742210';
        
        // Check if user already exists
        $user = User::where('mobile', $mobile)->first();
        
        if (!$user) {
            // Create new user
            $user = User::create([
                'name' => 'مدیر سیستم',
                'mobile' => $mobile,
                'password' => Hash::make('123456'),
                'mobile_verified_at' => now(),
                'activation' => 1,
                'activation_date' => now(),
                'user_type' => 1,
                'status' => 1
            ]);
            
            $this->command->info("User created for mobile: {$mobile}");
        } else {
            $this->command->info("User already exists for mobile: {$mobile}");
        }
        
        // Assign admin role
        $user->syncRoles(['admin']);
        
        $this->command->info("Admin role assigned to: {$user->mobile}");
        $this->command->info("Login credentials: {$mobile} / 123456 (via SMS)");
    }
}