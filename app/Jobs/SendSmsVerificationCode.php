<?php

namespace App\Jobs;

use App\Services\SmsService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendSmsVerificationCode implements ShouldQueue
{
    use Queueable, InteractsWithQueue, SerializesModels;

    public int $tries = 3;
    public int $backoff = 60;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public string $mobile,
        public string $code
    ) {}

    /**
     * Execute the job.
     */
    public function handle(SmsService $smsService): void
    {
        $smsService->sendVerificationCode($this->mobile, $this->code);
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        logger()->error('Failed to send SMS verification code', [
            'mobile' => $this->mobile,
            'code' => $this->code,
            'error' => $exception->getMessage()
        ]);
    }
}
