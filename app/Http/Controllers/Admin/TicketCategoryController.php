<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Ticket\TicketCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TicketCategoryController extends Controller
{
    public function index(Request $request)
    {
        $query = TicketCategory::query();

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

        $categories = $query->withCount('tickets')
                           ->orderBy('created_at', 'desc')
                           ->paginate(15)
                           ->withQueryString();

        $stats = [
            'total' => TicketCategory::count(),
            'active' => TicketCategory::active()->count(),
            'inactive' => TicketCategory::inactive()->count(),
        ];

        return Inertia::render('Admin/Tickets/Categories/Index', [
            'categories' => $categories,
            'stats' => $stats,
            'filters' => $request->only(['status', 'search']),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:ticket_categories,name',
            'status' => 'sometimes|boolean',
        ]);

        TicketCategory::create([
            'name' => $request->name,
            'status' => $request->status ?? 1,
        ]);

        return back();
    }

    public function update(Request $request, TicketCategory $ticketCategory)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:ticket_categories,name,' . $ticketCategory->id,
            'status' => 'sometimes|boolean',
        ]);

        $ticketCategory->update($request->only(['name', 'status']));

        return back();
    }

    public function destroy(TicketCategory $ticketCategory)
    {
        if ($ticketCategory->tickets()->count() > 0) {
            return back()->withErrors(['message' => 'این دسته‌بندی دارای تیکت است و قابل حذف نیست']);
        }

        $ticketCategory->delete();

        return back();
    }

    public function bulkUpdate(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:ticket_categories,id',
            'action' => 'required|in:activate,deactivate,delete',
        ]);

        $categories = TicketCategory::whereIn('id', $request->ids);

        switch ($request->action) {
            case 'activate':
                $categories->update(['status' => 1]);
                break;
            case 'deactivate':
                $categories->update(['status' => 0]);
                break;
            case 'delete':
                foreach ($categories->get() as $category) {
                    if ($category->tickets()->count() === 0) {
                        $category->delete();
                    }
                }
                break;
        }

        return back();
    }
}