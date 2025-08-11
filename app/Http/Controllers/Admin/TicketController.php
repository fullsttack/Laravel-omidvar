<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Ticket\Ticket;
use App\Models\Ticket\TicketCategory;
use App\Models\Ticket\TicketPriority;
use App\Models\Ticket\TicketAdmin;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TicketController extends Controller
{
    public function index(Request $request)
    {
        $query = Ticket::with(['user', 'category', 'priority', 'admin.user']);

        if ($request->has('status')) {
            if ($request->status === 'open') {
                $query->open();
            } elseif ($request->status === 'closed') {
                $query->closed();
            } elseif ($request->status === 'answered') {
                $query->answered();
            }
        }

        if ($request->has('seen')) {
            if ($request->seen === '1') {
                $query->seen();
            } elseif ($request->seen === '0') {
                $query->unseen();
            }
        }

        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('priority_id')) {
            $query->where('priority_id', $request->priority_id);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('subject', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhereHas('user', function($userQuery) use ($search) {
                      $userQuery->where('name', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%")
                                ->orWhere('mobile', 'like', "%{$search}%");
                  });
            });
        }

        $tickets = $query->parents()
                         ->orderBy('created_at', 'desc')
                         ->paginate(15)
                         ->withQueryString();

        $stats = [
            'total' => Ticket::parents()->count(),
            'open' => Ticket::parents()->open()->count(),
            'closed' => Ticket::parents()->closed()->count(),
            'answered' => Ticket::parents()->answered()->count(),
            'unseen' => Ticket::parents()->unseen()->count(),
        ];

        $categories = TicketCategory::active()->get();
        $priorities = TicketPriority::active()->get();

        return Inertia::render('Admin/Tickets/Index', [
            'tickets' => $tickets,
            'stats' => $stats,
            'categories' => $categories,
            'priorities' => $priorities,
            'filters' => $request->only(['status', 'seen', 'search', 'category_id', 'priority_id']),
        ]);
    }

    public function show(Ticket $ticket)
    {
        $ticket->load(['user', 'category', 'priority', 'admin.user', 'replies.user', 'replies.files', 'files', 'parent.user']);

        if (!$ticket->seen) {
            $ticket->update(['seen' => 1]);
        }

        return Inertia::render('Admin/Tickets/Show', [
            'ticket' => $ticket,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'subject' => 'nullable|string|max:255',
            'description' => 'required|string',
            'ticket_id' => 'required|exists:tickets,id',
            'status' => 'sometimes|integer|in:0,1,2',
        ]);

        $parentTicket = Ticket::findOrFail($request->ticket_id);

        $ticket = Ticket::create([
            'subject' => $request->subject,
            'description' => $request->description,
            'status' => $request->status ?? 2,
            'seen' => 0,
            'reference_id' => $parentTicket->reference_id,
            'user_id' => auth()->id(),
            'category_id' => $parentTicket->category_id,
            'priority_id' => $parentTicket->priority_id,
            'ticket_id' => $request->ticket_id,
        ]);

        $parentTicket->update(['status' => 2]);

        return redirect()->route('admin.tickets.show', $parentTicket);
    }

    public function update(Request $request, Ticket $ticket)
    {
        $request->validate([
            'status' => 'sometimes|integer|in:0,1,2',
            'seen' => 'sometimes|boolean',
            'subject' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
        ]);

        $ticket->update($request->only(['status', 'seen', 'subject', 'description']));

        return back();
    }

    public function destroy(Ticket $ticket)
    {
        $ticket->delete();

        return back();
    }

    public function bulkUpdate(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:tickets,id',
            'action' => 'required|in:close,open,answer,delete,mark_seen',
        ]);

        $tickets = Ticket::whereIn('id', $request->ids);

        switch ($request->action) {
            case 'open':
                $tickets->update(['status' => 0]);
                break;
            case 'close':
                $tickets->update(['status' => 1]);
                break;
            case 'answer':
                $tickets->update(['status' => 2]);
                break;
            case 'mark_seen':
                $tickets->update(['seen' => 1]);
                break;
            case 'delete':
                $tickets->delete();
                break;
        }

        return back();
    }
}