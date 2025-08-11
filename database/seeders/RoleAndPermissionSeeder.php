<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;

class RoleAndPermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions for admin panel
        $adminPermissions = [
            'manage users',
            'view user details',
            'assign roles',
            'manage roles',
            'manage permissions',
            'manage comments',
            'manage tickets',
            'manage ticket categories',
            'manage ticket priorities',
            'manage ticket admins',
            'view admin dashboard',
            'bulk update comments',
            'bulk update tickets',
            'bulk update ticket categories',
            'bulk update ticket priorities',
            'bulk update users',
        ];

        foreach ($adminPermissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Create role
        $adminRole = Role::firstOrCreate(['name' => 'admin']);

        // Assign permissions to admin role (admin has all admin permissions)
        $adminRole->syncPermissions($adminPermissions);

        // Create a default admin user if it doesn't exist
        $adminUser = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'مدیر سیستم',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]
        );

        // Assign admin role to admin user
        $adminUser->assignRole('admin');

        $this->command->info('Roles and permissions created successfully!');
        $this->command->info('Admin user created: admin@example.com / password');
    }
}