<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class MobileVerification extends Model
{
    protected $fillable = [
        'mobile',
        'code',
        'expires_at',
        'verified',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'verified' => 'boolean',
    ];

    public static function generateCode(): string
    {
        return str_pad(random_int(100000, 999999), 6, '0', STR_PAD_LEFT);
    }

    public static function createForMobile(string $mobile): self
    {
        $code = self::generateCode();
        $expiresAt = Carbon::now()->addMinutes(5);

        return self::create([
            'mobile' => $mobile,
            'code' => $code,
            'expires_at' => $expiresAt,
            'verified' => false,
        ]);
    }

    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }

    public function isValid(string $code): bool
    {
        return !$this->isExpired() && 
               !$this->verified && 
               $this->code === $code;
    }

    public function markAsVerified(): void
    {
        $this->update(['verified' => true]);
    }
}
