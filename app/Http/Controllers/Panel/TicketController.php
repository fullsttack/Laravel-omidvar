<?php

namespace App\Http\Controllers\Panel;

use App\Http\Controllers\Controller;
use App\Models\Ticket\Ticket;
use App\Models\Ticket\TicketCategory;
use App\Models\Ticket\TicketPriority;
use App\Models\Ticket\TicketAdmin;
use App\Models\Ticket\TicketFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class TicketController extends Controller
{
    public function index(Request $request)
    {
        $query = Ticket::with(['category', 'priority', 'admin.user'])
                       ->where('user_id', auth()->id());

        if ($request->has('status')) {
            if ($request->status === 'open') {
                $query->open();
            } elseif ($request->status === 'closed') {
                $query->closed();
            } elseif ($request->status === 'answered') {
                $query->answered();
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
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $tickets = $query->parents()
                         ->orderBy('created_at', 'desc')
                         ->paginate(10)
                         ->withQueryString();

        $stats = [
            'total' => Ticket::where('user_id', auth()->id())->parents()->count(),
            'open' => Ticket::where('user_id', auth()->id())->parents()->open()->count(),
            'closed' => Ticket::where('user_id', auth()->id())->parents()->closed()->count(),
            'answered' => Ticket::where('user_id', auth()->id())->parents()->answered()->count(),
        ];

        $categories = TicketCategory::active()->get();
        $priorities = TicketPriority::active()->get();

        return Inertia::render('panel/Tickets/Index', [
            'tickets' => $tickets,
            'stats' => $stats,
            'categories' => $categories,
            'priorities' => $priorities,
            'filters' => $request->only(['status', 'search', 'category_id', 'priority_id']),
        ]);
    }

    public function show(Ticket $ticket)
    {
        if ($ticket->user_id !== auth()->id()) {
            abort(403);
        }

        $ticket->load(['category', 'priority', 'admin.user', 'replies.user', 'replies.files', 'files', 'parent.user']);

        if (!$ticket->seen && $ticket->user_id === auth()->id()) {
            $ticket->update(['seen' => 1]);
        }

        return Inertia::render('panel/Tickets/Show', [
            'ticket' => $ticket,
        ]);
    }

    public function create()
    {
        $categories = TicketCategory::active()->get();
        $priorities = TicketPriority::active()->get();
        $admins = TicketAdmin::with('user')->get();

        return Inertia::render('panel/Tickets/Create', [
            'categories' => $categories,
            'priorities' => $priorities,
            'admins' => $admins,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'subject' => 'required|string|max:255',
            'description' => 'required|string',
            'category_id' => 'required|exists:ticket_categories,id',
            'priority_id' => 'required|exists:ticket_priorities,id',
            'reference_id' => 'required|exists:ticket_admins,id',
            'files.*' => 'sometimes|file|mimes:jpg,jpeg,png,pdf,doc,docx,txt|max:2048',
        ]);

        $ticket = Ticket::create([
            'subject' => $request->subject,
            'description' => $request->description,
            'status' => 0,
            'seen' => 0,
            'reference_id' => $request->reference_id,
            'user_id' => auth()->id(),
            'category_id' => $request->category_id,
            'priority_id' => $request->priority_id,
        ]);

        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $path = $file->store('tickets', 'public');
                
                TicketFile::create([
                    'file_path' => $path,
                    'file_size' => $file->getSize(),
                    'file_type' => $file->getMimeType(),
                    'status' => 1,
                    'ticket_id' => $ticket->id,
                    'user_id' => auth()->id(),
                ]);
            }
        }

        return redirect()->route('panel.tickets.show', $ticket);
    }

    public function update(Request $request, Ticket $ticket)
    {
        if ($ticket->user_id !== auth()->id()) {
            abort(403);
        }

        $request->validate([
            'subject' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
        ]);

        $ticket->update($request->only(['subject', 'description']));

        return response()->json([
            'message' => 'تیکت شما ویرایش شد.',
            'ticket' => $ticket,
        ]);
    }

    public function reply(Request $request, Ticket $ticket)
    {
        if ($ticket->user_id !== auth()->id()) {
            abort(403);
        }

        $request->validate([
            'description' => 'required|string',
            'files.*' => 'sometimes|file|mimes:jpg,jpeg,png,pdf,doc,docx,txt|max:2048',
        ]);

        $reply = Ticket::create([
            'subject' => null,
            'description' => $request->description,
            'status' => 0,
            'seen' => 0,
            'reference_id' => $ticket->reference_id,
            'user_id' => auth()->id(),
            'category_id' => $ticket->category_id,
            'priority_id' => $ticket->priority_id,
            'ticket_id' => $ticket->id,
        ]);

        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $path = $file->store('tickets', 'public');
                
                TicketFile::create([
                    'file_path' => $path,
                    'file_size' => $file->getSize(),
                    'file_type' => $file->getMimeType(),
                    'status' => 1,
                    'ticket_id' => $reply->id,
                    'user_id' => auth()->id(),
                ]);
            }
        }

        $ticket->update(['status' => 0]);

        return response()->json([
            'message' => 'پاسخ شما ارسال شد.',
            'reply' => $reply->load(['user', 'files']),
        ]);
    }

    public function destroy(Ticket $ticket)
    {
        if ($ticket->user_id !== auth()->id()) {
            abort(403);
        }

        if ($ticket->replies()->count() > 0) {
            return response()->json([
                'message' => 'این تیکت دارای پاسخ است و قابل حذف نیست',
            ], 422);
        }

        foreach ($ticket->files as $file) {
            Storage::disk('public')->delete($file->file_path);
            $file->delete();
        }

        $ticket->delete();

        return response()->json([
            'message' => 'تیکت با موفقیت حذف شد.',
        ]);
    }
}