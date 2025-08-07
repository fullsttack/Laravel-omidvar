import React from 'react';
import { Link } from '@inertiajs/react';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import DiscountBanner from '@/components/discount-banner';
import Autoplay from 'embla-carousel-autoplay';

interface Category {
    id: string;
    name: string;
    image: string;
    count: number;
    featured?: boolean;
}

const categories: Category[] = [
    {
        id: '1',
        name: 'برنج و حبوبات',
        image: '/images/product/1.webp',
        count: 45,
        featured: true
    },
    {
        id: '2',
        name: 'خشکبار و آجیل',
        image: '/images/product/2.webp',
        count: 38
    },
    {
        id: '3',
        name: 'ادویه و چاشنی',
        image: '/images/product/3.webp',
        count: 67
    },
    {
        id: '4',
        name: 'چای و قهوه',
        image: '/images/product/4.webp',
        count: 29
    },
    {
        id: '5',
        name: 'شیرینی و تنقلات',
        image: '/images/product/5.webp',
        count: 52
    },
    {
        id: '6',
        name: 'کنسرو و آماده',
        image: '/images/product/6.webp',
        count: 34
    },
    {
        id: '7',
        name: 'روغن و سرکه',
        image: '/images/product/7.webp',
        count: 18
    },
    {
        id: '8',
        name: 'لبنیات تازه',
        image: '/images/product/8.webp',
        count: 41
    }
];

export default function Categories() {
    const plugin = React.useRef(
        Autoplay({ delay: 4000, stopOnInteraction: false })
    );

    return (
        <div className="py-16 bg-white">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-xl md:text-4xl font-bold text-gray-900 mb-4">
                        دسته‌بندی محصولات
                    </h2>
                    <p className="text-xs sm:text-lg text-gray-600 max-w-2xl mx-auto">
                        مجموعه کاملی از بهترین محصولات غذایی و خوراکی با کیفیت درجه یک
                    </p>
                </div>

                {/* Categories Carousel */}
                <Carousel
                    className="w-full"
                    plugins={[plugin.current]}
                    opts={{
                        align: "start",
                        loop: true,
                        direction: "rtl",
                    }}
                >
                    <CarouselContent className="-ml-1 md:-ml-2">
                        {categories.map((category) => (
                            <CarouselItem key={category.id} className="pl-1 md:pl-2 basis-[30%] md:basis-[23%] lg:basis-[15%]">
                                <Link
                                    href="#"
                                    className="group flex flex-col items-center p-3 rounded-2xl bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    {/* Image Container */}
                                    <div className="relative mb-3">
                                        <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden bg-gradient-to-br from-green-600 to-emerald-100 p-2 group-hover:from-emerald-100 group-hover:to-green-600 transition-all duration-300">
                                            <div className="w-full h-full rounded-full overflow-hidden bg-white shadow-md">
                                                <img
                                                    src={category.image}
                                                    alt={category.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Category Info */}
                                    <div className="text-center">
                                        <h3 className="text-sm font-semibold text-gray-800 mb-1 group-hover:text-green-600 transition-colors leading-tight">
                                            {category.name}
                                        </h3>
                                        <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
                                            <span>{category.count}</span>
                                            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                                            <span>محصول</span>
                                        </div>
                                    </div>

                                    {/* Hover Line Effect */}
                                    <div className="w-0 h-0.5 bg-gradient-to-r from-green-400 to-emerald-500 group-hover:w-8 transition-all duration-300 mt-2 rounded-full"></div>
                                </Link>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>

                <DiscountBanner />
            </div>
        </div>
    );
}