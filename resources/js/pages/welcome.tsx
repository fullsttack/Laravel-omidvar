import { Head } from '@inertiajs/react';
import SiteHeader from '@/components/site-header';
import HeroBanners from '@/components/hero-banners';

export default function Welcome() {

    return (
        <>
            <Head title="فروشگاه اُمیدوار" />
            <div className="min-h-screen bg-background">
                <SiteHeader />
                <HeroBanners />

                <main className="container mx-auto py-12 px-4">
                    {/* Additional content can be added here */}
                </main>
            </div>
        </>
    );
}