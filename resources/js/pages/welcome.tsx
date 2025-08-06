import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="صفحه اصلی" />
            <div className="min-h-screen bg-gray-50">
                <header className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-6">
                            <div className="flex items-center">
                                <h1 className="text-2xl font-bold text-gray-900">اُمیدوار</h1>
                            </div>
                            
                            <nav className="flex items-center gap-4">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-full hover:bg-green-700 transition-colors"
                                    >
                                        داشبورد
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="inline-flex items-center px-6 py-2 bg-green-600 text-white text-sm font-medium rounded-full hover:bg-green-700 transition-colors"
                                        >
                                            ورود / ثبت نام
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </div>
                    </div>
                </header>
                
                <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-4xl font-bold text-gray-900 mb-6">خوش آمدید</h2>
                        <p className="text-lg text-gray-600">به سیستم اُمیدوار خوش آمدید</p>
                    </div>
                </main>
            </div>
        </>
    );
}