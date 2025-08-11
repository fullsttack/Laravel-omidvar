<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class PanelController extends Controller
{
    public function index()
    {
        return Inertia::render('panel/index');
    }

    public function profile()
    {
        return Inertia::render('panel/profile');
    }

    public function addresses()
    {
        return Inertia::render('panel/addresses');
    }

    public function orders()
    {
        return Inertia::render('panel/orders');
    }

    public function transactions()
    {
        return Inertia::render('panel/transactions');
    }

    public function lists()
    {
        return Inertia::render('panel/lists');
    }

    public function comments()
    {
        return Inertia::render('panel/comments');
    }

    public function tickets()
    {
        return Inertia::render('panel/tickets');
    }
}