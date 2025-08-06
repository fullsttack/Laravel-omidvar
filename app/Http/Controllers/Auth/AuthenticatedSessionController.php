<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\MobileVerification;
use App\Models\User;
use App\Services\SmsService;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Show the mobile authentication page.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('auth/mobile-auth', [
            'status' => $request->session()->get('status'),
            'step' => $request->session()->get('step'),
            'mobile' => $request->session()->get('mobile'),
        ]);
    }

    /**
     * Send SMS verification code.
     */
    public function sendCode(Request $request)
    {
        $request->validate([
            'mobile' => 'required|regex:/^09[0-9]{9}$/'
        ]);

        $mobile = $request->mobile;
        
        // Delete old verification codes for this mobile
        MobileVerification::where('mobile', $mobile)->delete();
        
        // Create new verification code
        $verification = MobileVerification::createForMobile($mobile);
        
        // Dispatch SMS job to queue
        try {
            \App\Jobs\SendSmsVerificationCode::dispatch($mobile, $verification->code)
                ->onQueue('sms');
            
            return back()->with('status', 'کد تایید ارسال شد')->with('step', 'code')->with('mobile', $mobile);
        } catch (\Exception $e) {
            return back()->withErrors(['mobile' => 'خطا در ارسال پیامک']);
        }
    }

    /**
     * Verify code and login/register user.
     */
    public function verifyCode(Request $request): RedirectResponse
    {
        $request->validate([
            'mobile' => 'required|regex:/^09[0-9]{9}$/',
            'code' => 'required|digits:6'
        ]);

        $mobile = $request->mobile;
        $code = $request->code;

        // Find the verification record
        $verification = MobileVerification::where('mobile', $mobile)
            ->where('verified', false)
            ->orderBy('created_at', 'desc')
            ->first();

        if (!$verification || !$verification->isValid($code)) {
            throw ValidationException::withMessages([
                'code' => 'کد تایید نامعتبر یا منقضی شده است'
            ]);
        }

        // Mark verification as used
        $verification->markAsVerified();

        // Check if user exists
        $user = User::where('mobile', $mobile)->first();

        if ($user) {
            // Update mobile verification timestamp
            $user->update(['mobile_verified_at' => Carbon::now()]);
            
            // Login existing user
            Auth::login($user);
        } else {
            // Register new user
            $user = User::create([
                'name' => 'کاربر ' . substr($mobile, -4),
                'mobile' => $mobile,
                'mobile_verified_at' => Carbon::now(),
                'password' => Hash::make(str()->random(32))
            ]);
            
            Auth::login($user);
        }

        $request->session()->regenerate();

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
