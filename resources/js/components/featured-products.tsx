import React from 'react';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import ProductCard from '@/components/product-card';
import Autoplay from 'embla-carousel-autoplay';

interface Product {
    id: string;
    name: string;
    image: string;
    price: number;
    originalPrice?: number;
    discount?: number;
    rating?: number;
    reviewCount?: number;
    isNew?: boolean;
    isBestSeller?: boolean;
    inStock?: boolean;
}

// Sample products data - Replace with actual data from backend
const featuredProducts: Product[] = [
    {
        id: '1',
        name: 'برنج هاشمی درجه یک گیلان - 10 کیلوگرم',
        image: '/images/product/1.webp',
        price: 850000,
        originalPrice: 950000,
        rating: 4.8,
        reviewCount: 142,
        isBestSeller: true,
        inStock: true
    },
    {
        id: '2',
        name: 'زعفران سرگل نگین ممتاز - 4.6 گرم',
        image: '/images/product/2.webp',
        price: 320000,
        originalPrice: 380000,
        rating: 4.9,
        reviewCount: 89,
        isNew: true,
        inStock: true
    },
    {
        id: '3',
        name: 'خرما مضافتی تازه - 1 کیلوگرم',
        image: '/images/product/3.webp',
        price: 180000,
        rating: 4.7,
        reviewCount: 67,
        inStock: true
    },
    {
        id: '4',
        name: 'چای احمد انگلیسی ارل گری - 500 گرم',
        image: '/images/product/4.webp',
        price: 95000,
        originalPrice: 120000,
        rating: 4.6,
        reviewCount: 234,
        inStock: true
    },
    {
        id: '5',
        name: 'عسل طبیعی گون - 900 گرم',
        image: '/images/product/5.webp',
        price: 240000,
        originalPrice: 280000,
        rating: 4.9,
        reviewCount: 156,
        isBestSeller: true,
        inStock: true
    },
    {
        id: '6',
        name: 'پسته احمدآقایی اکبری - 500 گرم',
        image: '/images/product/6.webp',
        price: 450000,
        originalPrice: 520000,
        rating: 4.8,
        reviewCount: 98,
        inStock: true
    },
    {
        id: '7',
        name: 'زیتون پرورده شده شمال - 700 گرم',
        image: '/images/product/7.webp',
        price: 85000,
        rating: 4.5,
        reviewCount: 45,
        isNew: true,
        inStock: true
    },
    {
        id: '8',
        name: 'روغن زیتون اکسترا ورجین - 500 میلی‌لیتر',
        image: '/images/product/8.webp',
        price: 195000,
        originalPrice: 230000,
        rating: 4.7,
        reviewCount: 123,
        inStock: true
    },
    {
        id: '9',
        name: 'قهوه ترک اصیل استانبول - 250 گرم',
        image: '/images/product/9.webp',
        price: 125000,
        rating: 4.6,
        reviewCount: 87,
        inStock: false
    },
    {
        id: '10',
        name: 'شکلات تلخ لینت سوئیس - 200 گرم',
        image: '/images/product/10.webp',
        price: 160000,
        originalPrice: 190000,
        rating: 4.9,
        reviewCount: 201,
        isNew: true,
        inStock: true
    }
];



export default function FeaturedProducts() {
    const plugin = React.useRef(
        Autoplay({ delay: 3500, stopOnInteraction: false })
    );

    return (
        <div className="py-16">
            <div className="container mx-auto max-w-7xl  px-4">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl md:text-xl font-bold text-gray-700 mb-4">
                       پرفروش ترین محصولات
                    </h2>
                    <p className="text-xs sm:text-base text-gray-600">
                       مشاهده همه
                    </p>
                </div>

                {/* Products Carousel */}
                <Carousel
                    className="w-full"
                    plugins={[plugin.current]}
                    opts={{
                        align: "start",
                        loop: true,
                        direction: "rtl",
                    }}
                >
                    <CarouselContent className="-ml-1 md:-ml-4">
                        {featuredProducts.map((product) => (
                            <CarouselItem 
                                key={product.id} 
                                className="pl-1 md:pl-4 basis-[85%] sm:basis-[70%] md:basis-[50%] lg:basis-[33.333%] xl:basis-[25%]"
                            >
                                <ProductCard product={product} />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>

            </div>
        </div>
    );
}