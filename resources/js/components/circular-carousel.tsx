import React from 'react';
import { Tag, Percent } from 'lucide-react';

interface Product {
    id: number;
    image: string;
    discount: string;
}

interface CircularCarouselProps {
    products: Product[];
    duration?: number;
}

export default function CircularCarousel({ products, duration = 20 }: CircularCarouselProps) {
    return (
        <div className="relative w-full h-96 mx-auto overflow-visible -mt-44">


            {Array.from({ length: 12 }, (_, i) => products[i % products.length]).map((product, index) => (
                <div
                    key={`${product.id}-${index}`}
                    className="absolute circular-item"
                    style={{
                        animationDelay: `${(index * duration) / 7}s`,
                        left: '50%',
                        top: '50%',
                        marginLeft: '-54px',
                        marginTop: '-48px',
                        transform: 'rotate(-45deg) translateX(160px) rotate(45deg) scale(0.6)',
                        opacity: 0
                    }}
                >
                    <div className="relative group">
                        {/* Discount Badge */}
                        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1 z-10">
                            <Tag className="h-3 w-3" />
                            {product.discount}
                        </div>

                        <div className="w-32 h-32 bg-white/30 rounded-full p-2 backdrop-blur-sm hover:scale-110 transition-all duration-300 group-hover:bg-white/40">
                            <img
                                src={product.image}
                                alt="محصول ویژه"
                                className="w-full h-full object-cover rounded-full"
                            />
                        </div>
                    </div>
                </div>
            ))}


            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Percent className="h-8 w-8 text-white" />
            </div>

            <style>{`
                .circular-item {
                    animation: circular-path ${duration}s linear infinite;
                }

                @keyframes circular-path {
                    0% {
                        transform: rotate(-45deg) translateX(160px) rotate(45deg) scale(0.6);
                        opacity: 0;
                    }
                    12.5% {
                        transform: rotate(0deg) translateX(160px) rotate(0deg) scale(0.8);
                        opacity: 0.7;
                    }
                    25% {
                        transform: rotate(45deg) translateX(160px) rotate(-45deg) scale(1);
                        opacity: 1;
                    }
                    37.5% {
                        transform: rotate(90deg) translateX(160px) rotate(-90deg) scale(1);
                        opacity: 1;
                    }
                    50% {
                        transform: rotate(135deg) translateX(160px) rotate(-135deg) scale(0.8);
                        opacity: 0.7;
                    }
                    62.5% {
                        transform: rotate(180deg) translateX(160px) rotate(-180deg) scale(0.6);
                        opacity: 0.4;
                    }
                    75% {
                        transform: rotate(225deg) translateX(160px) rotate(-225deg) scale(0.4);
                        opacity: 0.2;
                    }
                    87.5% {
                        transform: rotate(270deg) translateX(160px) rotate(-270deg) scale(0.4);
                        opacity: 0;
                    }
                    100% {
                        transform: rotate(315deg) translateX(160px) rotate(-315deg) scale(0.6);
                        opacity: 0;
                    }
                }
            `}</style>
        </div>
    );
}