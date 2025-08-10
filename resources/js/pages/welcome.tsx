import { Head } from '@inertiajs/react';
import SiteHeader from '@/components/site-header';
import Stories from '@/components/stories';
import HeroBanners from '@/components/hero-banners';
import Categories from '@/components/categories';
import FeaturedProducts from '@/components/featured-products';
import MobileBottomNav from '@/components/mobile-bottom-nav';
import DiscountBanner from '@/components/discount-banner';
import BannerProduct from '@/components/banner/banner-product';
import NewProducts from '@/components/product/new-products';
import BannerDiscount from '@/components/banner/banner-discount';
import DiscountProducts from '@/components/product/discount-products';
import LastBlog from '@/components/last-blog';
import AboutFooter from '@/components/about-footer';
import Footer from '@/components/footer';


export default function Welcome() {

    return (
        <>
            <Head title="فروشگاه اُمیدوار" />
            <div className="min-h-screen flex flex-col gap-2 pb-6 md:pb-6">
                <SiteHeader />
                <Stories/>
                <HeroBanners />
                <Categories />
                <FeaturedProducts />
                <BannerProduct />
                <NewProducts />
                <BannerDiscount />
                <DiscountProducts />
                <DiscountBanner />
                <LastBlog />
                <AboutFooter />
                <Footer />
                
                <MobileBottomNav />
            </div>
        </>
    );
}