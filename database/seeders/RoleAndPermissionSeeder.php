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

        // Create permissions for user panel
        $panelPermissions = [
            'view panel',
            'manage profile',
            'view orders',
            'view transactions',
            'manage addresses',
            'create comments',
            'edit own comments',
            'delete own comments',
            'create tickets',
            'view own tickets',
            'reply to own tickets',
        ];

        foreach ($panelPermissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Create roles
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $panelRole = Role::firstOrCreate(['name' => 'panel']);

        // Assign permissions to admin role (admin has all permissions)
        $allPermissions = Permission::all();
        $adminRole->syncPermissions($allPermissions);

        // Assign permissions to panel role (only user panel permissions)
        $panelRole->syncPermissions($panelPermissions);

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