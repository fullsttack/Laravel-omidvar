<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CommentController extends Controller
{
    public function index()
    {
        $comments = Comment::with(['author'])
            ->where('author_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('panel/Comments/Index', [
            'comments' => $comments,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'body' => 'required|string|max:2000',
            'commentable_id' => 'required|integer',
            'commentable_type' => 'required|string',
            'parent_id' => 'nullable|exists:comments,id',
        ]);

        $comment = Comment::create([
            'body' => $request->body,
            'author_id' => auth()->id(),
            'commentable_id' => $request->commentable_id,
            'commentable_type' => $request->commentable_type,
            'parent_id' => $request->parent_id,
            'status' => 1,
        ]);

        return response()->json([
            'message' => 'کامنت شما با موفقیت ثبت شد و پس از بررسی نمایش داده خواهد شد.',
            'comment' => $comment->load('author'),
        ]);
    }

    public function show(Comment $comment)
    {
        if ($comment->author_id !== auth()->id()) {
            abort(403);
        }

        return Inertia::render('panel/Comments/Show', [
            'comment' => $comment->load(['author', 'replies.author']),
        ]);
    }

    public function update(Request $request, Comment $comment)
    {
        if ($comment->author_id !== auth()->id()) {
            abort(403);
        }

        $request->validate([
            'body' => 'required|string|max:2000',
        ]);

        $comment->update([
            'body' => $request->body,
            'approved' => 0,
        ]);

        return response()->json([
            'message' => 'کامنت شما ویرایش شد و پس از بررسی نمایش داده خواهد شد.',
            'comment' => $comment->load('author'),
        ]);
    }

    public function destroy(Comment $comment)
    {
        if ($comment->author_id !== auth()->id()) {
            abort(403);
        }

        $comment->delete();

        return response()->json([
            'message' => 'کامنت با موفقیت حذف شد.',
        ]);
    }
}
