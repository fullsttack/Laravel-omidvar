<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Comment extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'body',
        'parent_id',
        'author_id',
        'commentable_id',
        'commentable_type',
        'seen',
        'approved',
        'status',
    ];

    protected $casts = [
        'seen' => 'boolean',
        'approved' => 'boolean',
        'status' => 'boolean',
    ];

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Comment::class, 'parent_id');
    }

    public function replies(): HasMany
    {
        return $this->hasMany(Comment::class, 'parent_id');
    }

    public function commentable(): MorphTo
    {
        return $this->morphTo();
    }

    public function scopeApproved($query)
    {
        return $query->where('approved', 1);
    }

    public function scopeUnapproved($query)
    {
        return $query->where('approved', 0);
    }

    public function scopeSeen($query)
    {
        return $query->where('seen', 1);
    }

    public function scopeUnseen($query)
    {
        return $query->where('seen', 0);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 1);
    }

    public function scopeParents($query)
    {
        return $query->whereNull('parent_id');
    }
}
