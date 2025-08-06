<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Redirect to mobile authentication.
     */
    public function create(): RedirectResponse
    {
        return redirect()->route('login');
    }

    /**
     * Registration is handled through mobile verification.
     */
    public function store(Request $request): RedirectResponse
    {
        return redirect()->route('login');
    }
}
