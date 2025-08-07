import { Head } from '@inertiajs/react';
import SiteHeader from '@/components/site-header';

export default function Welcome() {

    return (
        <>
            <Head title="فروشگاه اُمیدوار" />
            <div className="min-h-screen bg-background">
                <SiteHeader />

                <main className="container mx-auto py-12 px-4">
                    <h1 className="text-3xl font-bold text-center">خوش آمدید به فروشگاه اُمیدوار</h1>
                    <p className="text-center text-gray-600 mt-4">
                        بهترین محصولات خشکبار، برنج و آجیل را از ما بخرید
                    </p>
                </main>
            </div>
        </>
    );
}