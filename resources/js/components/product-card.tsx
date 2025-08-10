import React from 'react';
import { Link } from '@inertiajs/react';
import { Percent, Plus } from 'lucide-react';

interface Product {
    id: string;
    name: string;
    image: string;
    price: number;
    originalPrice?: number;
    discount?: number;
}

interface ProductCardProps {
    product: Product;
    className?: string;
}

export default function ProductCard({ product, className = "" }: ProductCardProps) {
    const discountPercent = product.originalPrice && product.price
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : product.discount;

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('fa-IR').format(price);
    };

    return (
        <div className={`bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow duration-300 overflow-hidden ${className}`}>
            {/* Product Image */}
            <div className="relative ">
                {/* Corner Folded Label */}
                {discountPercent && discountPercent > 0 && (
                    <div className="absolute top-0 left-0 z-10">
                        <div className="relative">
                            {/* Main corner fold */}
                            <div className="w-10 h-10 bg-orange relative">
                                {/* Fold triangle */}
                                <div className="absolute top-0 right-0 w-0 h-0 border-t-3 border-r-3 border-t-red-300 border-r-transparent"></div>

                                {/* Discount symbol */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Percent className='text-gray-100' />
                                </div>


                            </div>

                            {/* Shadow underneath */}
                            <div className="absolute top-1 left-1 w-12 h-12 bg-red-900/20 -z-10"></div>
                        </div>
                    </div>
                )}

                <div className='w-full flex justify-center items-center'>
                    <Link href={`/products/${product.id}`}>
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-8/12 h-auto mx-auto"
                        />
                    </Link>
                </div>

            </div>

            {/* Product Info */}
            <div className="p-4 flex flex-col h-32">
                {/* Product Name */}
                <Link href={`/products/${product.id}`} className="flex-grow">
                    <h3 className="font-medium text-gray-600 text-sm mb-3 line-clamp-2 hover:text-green-600 transition-colors h-10">
                        {product.name}
                    </h3>
                </Link>

                {/* Price and Add to Cart */}
                <div className="flex items-end justify-between mt-auto">
                    {/* Add to Cart Button */}
                    <button className="bg-green hover:bg-green-800 text-white p-2 rounded-lg transition-colors">
                        <Plus className="h-6 w-6" />
                    </button>

                    {/* Price */}
                    <div className="text-left h-12 flex flex-col justify-end">
                        <div className="font-bold text-gray-900 text-lg">
                            {formatPrice(product.price)} تومان
                        </div>
                        <div className="h-5 flex items-center justify-end">
                            {product.originalPrice && product.originalPrice > product.price ? (
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-400 line-through">
                                        {formatPrice(product.originalPrice)}
                                    </span>
                                    <span className="bg-red-100 text-red-600 text-xs px-1 py-0.5 rounded">
                                        {discountPercent}%
                                    </span>
                                </div>
                            ) : (
                                <div></div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}