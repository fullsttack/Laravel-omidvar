<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminCommentController extends Controller
{
    public function index(Request $request)
    {
        $query = Comment::with(['author']);

        if ($request->has('status')) {
            if ($request->status === 'approved') {
                $query->approved();
            } elseif ($request->status === 'unapproved') {
                $query->unapproved();
            } elseif ($request->status === 'rejected') {
                $query->rejected();
            }
        }

        if ($request->has('seen')) {
            if ($request->seen === '1') {
                $query->seen();
            } elseif ($request->seen === '0') {
                $query->unseen();
            }
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('body', 'like', "%{$search}%")
                  ->orWhereHas('author', function($authorQuery) use ($search) {
                      $authorQuery->where('name', 'like', "%{$search}%")
                                  ->orWhere('email', 'like', "%{$search}%")
                                  ->orWhere('mobile', 'like', "%{$search}%");
                  });
            });
        }

        $comments = $query->orderBy('created_at', 'desc')
                          ->paginate(15)
                          ->withQueryString();

        $stats = [
            'total' => Comment::count(),
            'approved' => Comment::approved()->count(),
            'unapproved' => Comment::unapproved()->count(),
            'rejected' => Comment::rejected()->count(),
            'unseen' => Comment::unseen()->count(),
        ];

        return Inertia::render('Admin/Comments/Index', [
            'comments' => $comments,
            'stats' => $stats,
            'filters' => $request->only(['status', 'seen', 'search']),
        ]);
    }

    public function show(Comment $comment)
    {
        $comment->load(['author', 'replies.author', 'parent.author']);

        if (!$comment->seen) {
            $comment->update(['seen' => 1]);
        }

        return Inertia::render('Admin/Comments/Show', [
            'comment' => $comment,
        ]);
    }

    public function update(Request $request, Comment $comment)
    {
        $request->validate([
            'approved' => 'sometimes|integer|in:0,1,2',
            'status' => 'sometimes|boolean',
            'body' => 'sometimes|string|max:2000',
        ]);

        $comment->update($request->only(['approved', 'status', 'body']));

        return back();
    }

    public function destroy(Comment $comment)
    {
        $comment->delete();

        return back();
    }

    public function bulkUpdate(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:comments,id',
            'action' => 'required|in:approve,disapprove,reject,delete,mark_seen',
        ]);

        $comments = Comment::whereIn('id', $request->ids);

        switch ($request->action) {
            case 'approve':
                $comments->update(['approved' => 1]);
                break;
            case 'disapprove':
                $comments->update(['approved' => 0]);
                break;
            case 'reject':
                $comments->update(['approved' => 2]);
                break;
            case 'mark_seen':
                $comments->update(['seen' => 1]);
                break;
            case 'delete':
                $comments->delete();
                break;
        }

        return back();
    }
}
