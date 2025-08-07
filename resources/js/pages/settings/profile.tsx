import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'تنظیمات پروفایل',
        href: '/settings/profile',
    },
];

type ProfileForm = {
    first_name: string;
    last_name: string;
    national_code: string;
    mobile: string;
    email: string;
};

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage<SharedData>().props;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<ProfileForm>({
        first_name: auth.user.first_name || '',
        last_name: auth.user.last_name || '',
        national_code: auth.user.national_code || '',
        mobile: auth.user.mobile || '',
        email: auth.user.email || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('profile.update'), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="تنظیمات پروفایل" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="اطلاعات پروفایل" description="بروزرسانی اطلاعات شخصی خود" />

                    <form onSubmit={submit} className="space-y-6">

                        <div className="grid gap-2">
                            <Label htmlFor="first_name">نام</Label>

                            <Input
                                id="first_name"
                                className="mt-1 block w-full"
                                value={data.first_name}
                                onChange={(e) => setData('first_name', e.target.value)}
                                autoComplete="given-name"
                                placeholder="نام"
                            />

                            <InputError className="mt-2" message={errors.first_name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="last_name">نام خانوادگی</Label>

                            <Input
                                id="last_name"
                                className="mt-1 block w-full"
                                value={data.last_name}
                                onChange={(e) => setData('last_name', e.target.value)}
                                autoComplete="family-name"
                                placeholder="نام خانوادگی"
                            />

                            <InputError className="mt-2" message={errors.last_name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="national_code">کد ملی</Label>

                            <Input
                                id="national_code"
                                className="mt-1 block w-full"
                                value={data.national_code}
                                onChange={(e) => setData('national_code', e.target.value)}
                                placeholder="کد ملی"
                                dir="ltr"
                            />

                            <InputError className="mt-2" message={errors.national_code} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="mobile">شماره موبایل</Label>

                            <Input
                                id="mobile"
                                type="tel"
                                className="mt-1 block w-full"
                                value={data.mobile}
                                onChange={(e) => setData('mobile', e.target.value)}
                                autoComplete="tel"
                                placeholder="09123456789"
                                dir="ltr"
                            />

                            <InputError className="mt-2" message={errors.mobile} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">ادرس ایمیل</Label>

                            <Input
                                id="email"
                                type="email"
                                className="mt-1 block w-full"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                autoComplete="username"
                                placeholder="ادرس ایمیل"
                            />

                            <InputError className="mt-2" message={errors.email} />
                        </div>

                        {mustVerifyEmail && auth.user.email_verified_at === null && (
                            <div>
                                <p className="-mt-4 text-sm text-muted-foreground">
                                    ادرس ایمیل شما تایید نشده است.{' '}
                                    <Link
                                        href={route('verification.send')}
                                        method="post"
                                        as="button"
                                        className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current"
                                    >
                                        برای ارسال مجدد ایمیل تایید کلیک کنید.
                                    </Link>
                                </p>

                                {status === 'verification-link-sent' && (
                                    <div className="mt-2 text-sm font-medium text-green-600">
                                        لینک تایید جدید به ادرس ایمیل شما ارسال شد.
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex items-center gap-4">
                            <Button disabled={processing}>ذخیره</Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">ذخیره شد</p>
                            </Transition>
                        </div>
                    </form>
                </div>

            </SettingsLayout>
        </AppLayout>
    );
}
