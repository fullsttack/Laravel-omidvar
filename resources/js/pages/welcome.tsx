import { Head } from '@inertiajs/react';
import SiteHeader from '@/components/site-header';
import Stories from '@/components/stories';
import HeroBanners from '@/components/hero-banners';
import Categories from '@/components/categories';
import MobileBottomNav from '@/components/mobile-bottom-nav';

export default function Welcome() {

    return (
        <>
            <Head title="فروشگاه اُمیدوار" />
            <div className="min-h-screen pb-6 md:pb-6">
                <SiteHeader />
                <Stories/>
                <HeroBanners />
                <Categories />

                <main className="container mx-auto py-12 px-4 pb-20 md:pb-12">
                    {/* Additional content can be added here */}
                </main>
                
                <MobileBottomNav />
            </div>
        </>
    );
}