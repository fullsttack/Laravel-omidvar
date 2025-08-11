<?php

namespace App\Models\Ticket;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Ticket extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'subject',
        'description',
        'status',
        'seen',
        'reference_id',
        'user_id',
        'category_id',
        'priority_id',
        'ticket_id',
    ];

    protected $casts = [
        'status' => 'integer',
        'seen' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(TicketCategory::class);
    }

    public function priority(): BelongsTo
    {
        return $this->belongsTo(TicketPriority::class);
    }

    public function admin(): BelongsTo
    {
        return $this->belongsTo(TicketAdmin::class, 'reference_id');
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Ticket::class, 'ticket_id');
    }

    public function replies(): HasMany
    {
        return $this->hasMany(Ticket::class, 'ticket_id');
    }

    public function files(): HasMany
    {
        return $this->hasMany(TicketFile::class);
    }

    public function scopeOpen($query)
    {
        return $query->where('status', 0);
    }

    public function scopeClosed($query)
    {
        return $query->where('status', 1);
    }

    public function scopeAnswered($query)
    {
        return $query->where('status', 2);
    }

    public function scopeSeen($query)
    {
        return $query->where('seen', 1);
    }

    public function scopeUnseen($query)
    {
        return $query->where('seen', 0);
    }

    public function scopeParents($query)
    {
        return $query->whereNull('ticket_id');
    }
}
