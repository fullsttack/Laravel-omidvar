import React from 'react';
import { Link } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';

export default function DiscountBanner() {
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
                    <div className="relative">
                        {/* Product Image with Green Glow */}
                        <div className='flex gap-4'>
                            <div className="w-32 h-32 bg-white/20 rounded-full p-4 backdrop-blur-sm">
                                <img
                                    src="/images/product/9.webp"
                                    alt="محصول ویژه"
                                    className="w-full h-full object-cover rounded-full"
                                />
                            </div>

                            <div className="w-32 h-32 bg-white/20 rounded-full p-4 backdrop-blur-sm">
                                <img
                                    src="/images/product/2.webp"
                                    alt="محصول ویژه"
                                    className="w-full h-full object-cover rounded-full"
                                />
                            </div>

                            <div className="w-32 h-32 bg-white/20 rounded-full p-4 backdrop-blur-sm">
                                <img
                                    src="/images/product/1.webp"
                                    alt="محصول ویژه"
                                    className="w-full h-full object-cover rounded-full"
                                />
                            </div>

                            <div className="w-32 h-32 bg-white/20 rounded-full p-4 backdrop-blur-sm">
                                <img
                                    src="/images/product/3.webp"
                                    alt="محصول ویژه"
                                    className="w-full h-full object-cover rounded-full"
                                />
                            </div>
                        </div>

                        {/* Floating Discount Badge */}
                        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                            ۵۰٪ تخفیف
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}