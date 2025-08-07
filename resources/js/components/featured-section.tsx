import React from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Star,
    ShoppingCart,
    Heart,
    Eye,
    Truck,
    Shield,
    Award,
    TrendingUp
} from 'lucide-react';

interface Product {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    rating: number;
    reviews: number;
    badge?: string;
    discount?: number;
}

const featuredProducts: Product[] = [
    {
        id: '1',
        name: 'برنج هاشمی درجه یک',
        price: 125000,
        originalPrice: 150000,
        image: '/images/product/1.webp',
        rating: 4.8,
        reviews: 156,
        badge: 'پرفروش',
        discount: 17
    },
    {
        id: '2', 
        name: 'زعفران نگین ۵ گرمی',
        price: 890000,
        image: '/images/product/2.webp',
        rating: 4.9,
        reviews: 89,
        badge: 'ممتاز'
    },
    {
        id: '3',
        name: 'خشکبار مخلوط پرمیوم',
        price: 285000,
        originalPrice: 320000,
        image: '/images/product/3.webp',
        rating: 4.7,
        reviews: 203,
        discount: 11
    },
    {
        id: '4',
        name: 'چای احمد کیسه‌ای',
        price: 45000,
        image: '/images/product/4.webp',
        rating: 4.6,
        reviews: 134,
        badge: 'جدید'
    }
];

const features = [
    {
        icon: Truck,
        title: 'ارسال رایگان',
        description: 'برای خرید بالای ۳۰۰ هزار تومان'
    },
    {
        icon: Shield,
        title: 'گارانتی کیفیت',
        description: 'ضمانت اصالت و کیفیت محصولات'
    },
    {
        icon: Award,
        title: 'برند معتبر',
        description: '۲۰ سال تجربه در فروش مواد غذایی'
    },
    {
        icon: TrendingUp,
        title: 'قیمت مناسب',
        description: 'بهترین قیمت در بازار'
    }
];

export default function FeaturedSection() {
    const formatPrice = (price: number) => {
        return price.toLocaleString('fa-IR');
    };

    return (
        <div className="py-16 bg-gradient-to-b from-gray-50 to-white">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        محصولات ویژه
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        بهترین و محبوب‌ترین محصولات فروشگاه امیدوار با بالاترین کیفیت
                    </p>
                </div>

                {/* Featured Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {featuredProducts.map((product) => (
                        <div key={product.id} className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
                            <div className="relative overflow-hidden">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                                
                                {/* Badges */}
                                <div className="absolute top-3 right-3 flex flex-col gap-2">
                                    {product.discount && (
                                        <Badge className="bg-red-500 text-white">
                                            {product.discount}٪ تخفیف
                                        </Badge>
                                    )}
                                    {product.badge && (
                                        <Badge variant="secondary" className="bg-green-500 text-white">
                                            {product.badge}
                                        </Badge>
                                    )}
                                </div>

                                {/* Quick Actions */}
                                <div className="absolute top-3 left-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <Button size="sm" variant="secondary" className="w-10 h-10 p-0 bg-white/90 hover:bg-white">
                                        <Heart className="h-4 w-4" />
                                    </Button>
                                    <Button size="sm" variant="secondary" className="w-10 h-10 p-0 bg-white/90 hover:bg-white">
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="p-4">
                                {/* Product Name */}
                                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
                                    {product.name}
                                </h3>

                                {/* Rating */}
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="flex items-center gap-1">
                                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                        <span className="text-sm font-medium text-gray-700">{product.rating}</span>
                                    </div>
                                    <span className="text-xs text-gray-500">({product.reviews} نظر)</span>
                                </div>

                                {/* Price */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex flex-col">
                                        <span className="text-lg font-bold text-green-600">
                                            {formatPrice(product.price)} تومان
                                        </span>
                                        {product.originalPrice && (
                                            <span className="text-sm text-gray-400 line-through">
                                                {formatPrice(product.originalPrice)} تومان
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Add to Cart Button */}
                                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                                    <ShoppingCart className="h-4 w-4 ml-2" />
                                    افزودن به سبد
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Features Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {features.map((feature, index) => {
                        const IconComponent = feature.icon;
                        return (
                            <div key={index} className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                                <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                                    <IconComponent className="h-8 w-8 text-green-600" />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                                <p className="text-sm text-gray-600">{feature.description}</p>
                            </div>
                        );
                    })}
                </div>

                {/* Call to Action */}
                <div className="text-center">
                    <Link href="#shop">
                        <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8">
                            مشاهده همه محصولات
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}