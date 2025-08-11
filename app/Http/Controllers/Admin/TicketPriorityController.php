<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Ticket\TicketPriority;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TicketPriorityController extends Controller
{
    public function index(Request $request)
    {
        $query = TicketPriority::query();

        if ($request->has('status')) {
            if ($request->status === 'active') {
                $query->active();
            } elseif ($request->status === 'inactive') {
                $query->inactive();
            }
        }

        if ($request->has('search')) {
            $query->where('name', 'like', "%{$request->search}%");
        }

        $priorities = $query->withCount('tickets')
                           ->orderBy('created_at', 'desc')
                           ->paginate(15)
                           ->withQueryString();

        $stats = [
            'total' => TicketPriority::count(),
            'active' => TicketPriority::active()->count(),
            'inactive' => TicketPriority::inactive()->count(),
        ];

        return Inertia::render('Admin/Tickets/Priorities/Index', [
            'priorities' => $priorities,
            'stats' => $stats,
            'filters' => $request->only(['status', 'search']),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:ticket_priorities,name',
            'status' => 'sometimes|boolean',
        ]);

        TicketPriority::create([
            'name' => $request->name,
            'status' => $request->status ?? 1,
        ]);

        return back();
    }

    public function update(Request $request, TicketPriority $ticketPriority)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:ticket_priorities,name,' . $ticketPriority->id,
            'status' => 'sometimes|boolean',
        ]);

        $ticketPriority->update($request->only(['name', 'status']));

        return back();
    }

    public function destroy(TicketPriority $ticketPriority)
    {
        if ($ticketPriority->tickets()->count() > 0) {
            return back()->withErrors(['message' => 'این اولویت دارای تیکت است و قابل حذف نیست']);
        }

        $ticketPriority->delete();

        return back();
    }

    public function bulkUpdate(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:ticket_priorities,id',
            'action' => 'required|in:activate,deactivate,delete',
        ]);

        $priorities = TicketPriority::whereIn('id', $request->ids);

        switch ($request->action) {
            case 'activate':
                $priorities->update(['status' => 1]);
                break;
            case 'deactivate':
                $priorities->update(['status' => 0]);
                break;
            case 'delete':
                foreach ($priorities->get() as $priority) {
                    if ($priority->tickets()->count() === 0) {
                        $priority->delete();
                    }
                }
                break;
        }

        return back();
    }
}