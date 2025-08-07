import React from 'react';
import { Link } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';
import CircularCarousel from '@/components/circular-carousel';

export default function DiscountBanner() {
    const products = [
        { id: 1, image: "/images/product/9.webp", discount: "۲۰٪" },
        { id: 2, image: "/images/product/2.webp", discount: "۳۵٪" },
        { id: 3, image: "/images/product/1.webp", discount: "۱۵٪" },
        { id: 4, image: "/images/product/3.webp", discount: "۴۵٪" },
        { id: 5, image: "/images/product/5.webp", discount: "۲۵٪" },
        { id: 6, image: "/images/product/6.webp", discount: "۳۰٪" },
        { id: 7, image: "/images/product/7.webp", discount: "۱۰٪" },
        { id: 8, image: "/images/product/8.webp", discount: "۴۰٪" }
    ];


    return (
        <div className="mt-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 right-8 w-16 h-16 bg-white rounded-full"></div>
                <div className="absolute bottom-8 left-12 w-12 h-12 bg-white rounded-full"></div>
                <div className="absolute top-12 left-24 w-8 h-8 bg-white rounded-full"></div>
                <div className="absolute bottom-4 right-16 w-6 h-6 bg-white rounded-full"></div>
            </div>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                    <h3 className="text-2xl font-bold mb-2">پیشنهادات ویژه امیدوار</h3>
                    <p className="text-green-100 mb-4 leading-relaxed">
                        تخفیف‌های استثنایی روی محصولات منتخب تا ۵۰٪
                    </p>
                    <Link
                        href="#"
                        className="inline-flex items-center gap-2 bg-white text-green-600 px-6 py-3 rounded-lg font-medium hover:bg-green-50 transition-colors"
                    >
                        مشاهده تخفیف‌ها
                        <ChevronLeft className="h-4 w-4" />
                    </Link>
                </div>

                <div className="flex justify-center md:justify-end">
                    <div className="relative w-full max-w-lg">
                        {/* Circular Carousel */}
                        <CircularCarousel 
                            products={products} 
                            duration={16} 
                        />


                    </div>
                </div>
            </div>

        </div>
    );
}