<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $users = User::with('roles')
            ->when($request->search, function ($query) use ($request) {
                $query->where('name', 'like', '%' . $request->search . '%')
                    ->orWhere('email', 'like', '%' . $request->search . '%')
                    ->orWhere('mobile', 'like', '%' . $request->search . '%');
            })
            ->when($request->role && $request->role !== 'all', function ($query) use ($request) {
                $query->whereHas('roles', function ($q) use ($request) {
                    $q->where('name', $request->role);
                });
            })
            ->paginate(20)
            ->withQueryString();

        $roles = Role::all();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'roles' => $roles,
            'filters' => $request->only(['search', 'role'])
        ]);
    }

    public function show(User $user)
    {
        $user->load('roles', 'permissions');
        $allRoles = Role::all();
        $allPermissions = Permission::all();

        return Inertia::render('Admin/Users/Show', [
            'user' => $user,
            'allRoles' => $allRoles,
            'allPermissions' => $allPermissions
        ]);
    }

    public function assignRole(Request $request, User $user)
    {
        $request->validate([
            'role' => 'required|exists:roles,name'
        ]);

        $user->syncRoles([$request->role]);

        return back()->with('success', 'نقش کاربر با موفقیت تغییر کرد.');
    }

    public function removeRole(Request $request, User $user)
    {
        $request->validate([
            'role' => 'required|exists:roles,name'
        ]);

        $user->removeRole($request->role);

        return back()->with('success', 'نقش از کاربر حذف شد.');
    }

    public function givePermission(Request $request, User $user)
    {
        $request->validate([
            'permission' => 'required|exists:permissions,name'
        ]);

        $user->givePermissionTo($request->permission);

        return back()->with('success', 'مجوز به کاربر داده شد.');
    }

    public function revokePermission(Request $request, User $user)
    {
        $request->validate([
            'permission' => 'required|exists:permissions,name'
        ]);

        $user->revokePermissionTo($request->permission);

        return back()->with('success', 'مجوز از کاربر گرفته شد.');
    }

    public function bulkUpdate(Request $request)
    {
        $request->validate([
            'users' => 'required|array',
            'users.*' => 'exists:users,id',
            'action' => 'required|in:assign_role,remove_role',
            'role' => 'required_if:action,assign_role,remove_role|exists:roles,name'
        ]);

        $users = User::whereIn('id', $request->users)->get();

        foreach ($users as $user) {
            if ($request->action === 'assign_role') {
                $user->assignRole($request->role);
            } elseif ($request->action === 'remove_role') {
                $user->removeRole($request->role);
            }
        }

        return back()->with('success', 'عملیات گروهی با موفقیت انجام شد.');
    }
}