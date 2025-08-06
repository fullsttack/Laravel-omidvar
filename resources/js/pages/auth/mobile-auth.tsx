import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { Undo2 } from "lucide-react";

interface Props {
    status?: string;
    step?: 'mobile' | 'code';
    mobile?: string;
}

export default function MobileAuth({ status, step: initialStep, mobile: initialMobile }: Props) {
    const [step, setStep] = useState<'mobile' | 'code'>(initialStep || 'mobile');
    const [mobile, setMobile] = useState(initialMobile || '');
    const [countdown, setCountdown] = useState(0);

    const { data, setData, post, processing, errors, clearErrors } = useForm({
        mobile: '',
        code: '',
    });

    const submitMobile: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('mobile.send-code'), {
            onSuccess: (page) => {
                if (page.props.step === 'code' && page.props.mobile) {
                    setMobile(page.props.mobile as string);
                    setStep('code');
                    setCountdown(300); // 5 minutes
                    startCountdown();
                    clearErrors();
                }
            }
        });
    };

    const submitCode: FormEventHandler = (e) => {
        e.preventDefault();

        setData('mobile', mobile);
        post(route('mobile.verify-code'));
    };

    const startCountdown = () => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const resendCode = () => {
        setData('mobile', mobile);
        post(route('mobile.send-code'), {
            onSuccess: (page) => {
                if (page.props.step === 'code') {
                    setCountdown(300);
                    startCountdown();
                    clearErrors();
                }
            }
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Head title="ورود / ثبت نام" />



            {/* Main content */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
                {/* Icon */}
                <Link href="/" className="flex flex-col items-center gap-2 mb-20 text-green">
                    <Undo2 size={32} className="text-green" />بازگشت به صفحه اصلی
                </Link>

                {/* Title and subtitle */}
                <div className="text-center mb-8">
                    <p className="text-gray-600 text-lg">
                        {step === 'mobile'
                            ? 'لطفا شماره موبایل خود را وارد کنید'
                            : `کد تایید ارسال شده به ${mobile} را وارد کنید`
                        }
                    </p>
                </div>

                {status && (
                    <div className="text-sm font-medium text-green-600 text-center mb-4">
                        {status}
                    </div>
                )}

                {/* Form */}
                <div className="w-full max-w-sm">
                    {step === 'mobile' ? (
                        <form onSubmit={submitMobile} className="space-y-6">
                            <div>
                                <Input
                                    id="mobile"
                                    type="text"
                                    value={data.mobile}
                                    className="w-full h-12 text-center text-lg rounded-full border-gray-300 bg-white placeholder-gray-400"
                                    onChange={(e) => setData('mobile', e.target.value)}
                                    placeholder="09••••••••••"
                                    autoComplete="tel"
                                    dir="ltr"
                                    required
                                />
                                {errors.mobile && (
                                    <div className="text-sm text-red-600 mt-2 text-center">
                                        {errors.mobile}
                                    </div>
                                )}
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 cursor-pointer bg-green hover:bg-green-700 text-white rounded-full text-base font-semibold "
                                disabled={processing}
                            >
                                {processing ? 'در حال ارسال...' : 'ورود'}
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={submitCode} className="space-y-6">
                            <div>
                                <Input
                                    id="code"
                                    type="text"
                                    value={data.code}
                                    className="w-full h-12 text-center text-2xl tracking-wider rounded-full border-gray-300 bg-white"
                                    onChange={(e) => setData('code', e.target.value)}
                                    placeholder="● ● ● ● ● ●"
                                    maxLength={6}
                                    autoComplete="one-time-code"
                                    required
                                />
                                {errors.code && (
                                    <div className="text-sm text-red-600 mt-2 text-center">
                                        {errors.code}
                                    </div>
                                )}
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 bg-green-600 hover:bg-green-700 text-white rounded-full text-base font-semibold"
                                disabled={processing}
                            >
                                {processing ? 'در حال تایید...' : 'ورود'}
                            </Button>

                            <div className="text-center space-y-3">
                                {countdown > 0 ? (
                                    <p className="text-sm text-gray-500">
                                        ارسال مجدد کد تا {formatTime(countdown)}
                                    </p>
                                ) : (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="text-green-600 hover:text-green-700"
                                        onClick={resendCode}
                                        disabled={processing}
                                    >
                                        ارسال مجدد کد
                                    </Button>
                                )}
                            </div>
                        </form>
                    )}
                </div>

                {/* Terms and conditions */}
                <div className="mt-8 text-center">
                    <p className="text-xs text-gray-500 leading-relaxed">
                        ورود شما به معنای پذیرش شرایط سایت و قوانین حریم خصوصی است
                    </p>
                </div>
            </div>
        </div>
    );
}