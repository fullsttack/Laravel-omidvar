import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import SiteHeader from '@/components/site-header';
import Footer from '@/components/footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ProductCard from '@/components/product-card';
import {
    Heart,
    Share2,
    Star,
    Truck,
    Shield,
    RotateCcw,
    Plus,
    Minus,
    ShoppingCart,
    ChevronLeft,
    ChevronRight,
    CheckCircle,
    ThumbsUp,
} from 'lucide-react';

interface ProductDetailPageProps {
    product: {
        id: string;
        name: string;
        description: string;
        short_description: string;
        image: string;
        images: string[];
        price: number;
        originalPrice?: number;
        discount?: number;
        category: string;
        brand: string;
        stock: number;
        rating: number;
        reviews_count: number;
        specifications: Record<string, string>;
        features: string[];
        reviews: {
            id: number;
            user_name: string;
            avatar?: string | null;
            rating: number;
            title: string;
            comment: string;
            date: string;
            helpful_count: number;
            verified_purchase: boolean;
        }[];
        related_products: {
            id: string;
            name: string;
            image: string;
            price: number;
            originalPrice?: number;
            discount?: number;
        }[];
    };
}

export default function ProductDetail({ product }: ProductDetailPageProps) {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState('مشکی');
    const [showAllFeatures, setShowAllFeatures] = useState(false);
    const [showAllReviews, setShowAllReviews] = useState(false);
    const [helpfulReviews, setHelpfulReviews] = useState<number[]>([]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('fa-IR').format(price);
    };

    const discountPercent = product.originalPrice && product.price
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : product.discount || 0;

    const savings = product.originalPrice ? product.originalPrice - product.price : 0;

    const handleQuantityChange = (delta: number) => {
        const newQuantity = quantity + delta;
        if (newQuantity >= 1 && newQuantity <= product.stock) {
            setQuantity(newQuantity);
        }
    };

    const handleImageChange = (direction: 'next' | 'prev') => {
        if (direction === 'next') {
            setSelectedImageIndex((prev) => 
                prev === product.images.length - 1 ? 0 : prev + 1
            );
        } else {
            setSelectedImageIndex((prev) => 
                prev === 0 ? product.images.length - 1 : prev - 1
            );
        }
    };

    const handleReviewHelpful = (reviewId: number) => {
        setHelpfulReviews(prev => 
            prev.includes(reviewId) 
                ? prev.filter(id => id !== reviewId)
                : [...prev, reviewId]
        );
    };

    const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
        const sizeClasses = {
            sm: 'h-3 w-3',
            md: 'h-4 w-4',
            lg: 'h-5 w-5'
        };
        
        return (
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`${sizeClasses[size]} ${
                            star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        }`}
                    />
                ))}
            </div>
        );
    };

    return (
        <>
            <Head title={product.name} />
            <SiteHeader />
            
            <div className="container mx-auto px-4 py-6 max-w-7xl">
                {/* Breadcrumb */}
                <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
                    <Link href="/" className="hover:text-green-600">خانه</Link>
                    <span>/</span>
                    <Link href="/products" className="hover:text-green-600">محصولات</Link>
                    <span>/</span>
                    <span className="text-gray-900">{product.category}</span>
                    <span>/</span>
                    <span className="text-gray-500 truncate">{product.name}</span>
                </nav>

                {/* Main Content */}
                <div className="grid lg:grid-cols-2 gap-8 mb-12">
                    {/* Product Images */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden">
                            <img
                                src={product.images[selectedImageIndex]}
                                alt={product.name}
                                className="w-full h-full object-contain"
                            />
                            
                            {/* Image Navigation */}
                            {product.images.length > 1 && (
                                <>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                                        onClick={() => handleImageChange('prev')}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                                        onClick={() => handleImageChange('next')}
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </>
                            )}
                            
                            {/* Discount Badge */}
                            {discountPercent > 0 && (
                                <Badge className="absolute top-4 right-4 bg-red-500 hover:bg-red-600">
                                    {discountPercent}% تخفیف
                                </Badge>
                            )}
                        </div>
                        
                        {/* Thumbnail Images */}
                        {product.images.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {product.images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImageIndex(index)}
                                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                                            selectedImageIndex === index 
                                                ? 'border-green-500' 
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <img
                                            src={image}
                                            alt={`${product.name} - ${index + 1}`}
                                            className="w-full h-full object-contain bg-gray-50"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        {/* Brand & Title */}
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className="text-green-600 border-green-600">
                                    {product.brand}
                                </Badge>
                                <Badge variant="outline">
                                    {product.category}
                                </Badge>
                            </div>
                            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                                {product.name}
                            </h1>
                            <p className="text-gray-600 leading-relaxed">
                                {product.short_description}
                            </p>
                        </div>

                        {/* Rating & Reviews */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                {renderStars(product.rating, 'md')}
                                <span className="font-medium text-gray-900">{product.rating}</span>
                            </div>
                            <Separator orientation="vertical" className="h-4" />
                            <span className="text-gray-600">
                                {product.reviews_count} نظر
                            </span>
                            <Separator orientation="vertical" className="h-4" />
                            <div className="flex items-center gap-1 text-green-600">
                                <CheckCircle className="h-4 w-4" />
                                <span className="text-sm">تایید اصالت</span>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <span className="text-3xl font-bold text-gray-900">
                                    {formatPrice(product.price)} تومان
                                </span>
                                {product.originalPrice && product.originalPrice > product.price && (
                                    <span className="text-lg text-gray-400 line-through">
                                        {formatPrice(product.originalPrice)}
                                    </span>
                                )}
                            </div>
                            
                            {savings > 0 && (
                                <div className="text-green-600 font-medium">
                                    شما {formatPrice(savings)} تومان صرفه‌جویی می‌کنید!
                                </div>
                            )}
                        </div>

                        {/* Stock Status */}
                        <div className="flex items-center gap-2">
                            {product.stock > 0 ? (
                                <>
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                    <span className="text-green-600 font-medium">
                                        {product.stock} عدد در انبار
                                    </span>
                                </>
                            ) : (
                                <>
                                    <div className="h-5 w-5 rounded-full bg-red-500" />
                                    <span className="text-red-600 font-medium">
                                        ناموجود
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Color Selection */}
                        <div>
                            <h3 className="font-medium text-gray-900 mb-3">رنگ:</h3>
                            <div className="flex gap-2">
                                {['مشکی', 'آبی', 'صورتی'].map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => setSelectedColor(color)}
                                        className={`px-4 py-2 rounded-lg border transition-colors ${
                                            selectedColor === color
                                                ? 'border-green-500 bg-green-50 text-green-700'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        {color}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quantity & Add to Cart */}
                        {product.stock > 0 && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <span className="font-medium text-gray-900">تعداد:</span>
                                    <div className="flex items-center border border-gray-300 rounded-lg">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleQuantityChange(-1)}
                                            disabled={quantity <= 1}
                                        >
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                        <span className="px-4 py-2 min-w-16 text-center">{quantity}</span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleQuantityChange(1)}
                                            disabled={quantity >= product.stock}
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                
                                <div className="flex gap-3">
                                    <Button size="lg" className="flex-1 bg-green-600 hover:bg-green-700">
                                        <ShoppingCart className="w-5 h-5 ml-2" />
                                        افزودن به سبد خرید
                                    </Button>
                                    <Button variant="outline" size="lg">
                                        <Heart className="w-5 h-5" />
                                    </Button>
                                    <Button variant="outline" size="lg">
                                        <Share2 className="w-5 h-5" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Service Features */}
                        <div className="grid grid-cols-3 gap-4 pt-4">
                            <div className="text-center">
                                <div className="flex justify-center mb-2">
                                    <div className="p-3 bg-blue-100 rounded-full">
                                        <Truck className="h-6 w-6 text-blue-600" />
                                    </div>
                                </div>
                                <div className="text-sm text-gray-600">ارسال رایگان</div>
                            </div>
                            <div className="text-center">
                                <div className="flex justify-center mb-2">
                                    <div className="p-3 bg-green-100 rounded-full">
                                        <Shield className="h-6 w-6 text-green-600" />
                                    </div>
                                </div>
                                <div className="text-sm text-gray-600">گارانتی اصالت</div>
                            </div>
                            <div className="text-center">
                                <div className="flex justify-center mb-2">
                                    <div className="p-3 bg-orange-100 rounded-full">
                                        <RotateCcw className="h-6 w-6 text-orange-600" />
                                    </div>
                                </div>
                                <div className="text-sm text-gray-600">۷ روز ضمانت</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Details Tabs */}
                <Card className="mb-12">
                    <Tabs defaultValue="description" className="w-full">
                        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-4">
                            <TabsTrigger value="description">توضیحات</TabsTrigger>
                            <TabsTrigger value="specifications">مشخصات</TabsTrigger>
                            <TabsTrigger value="features">ویژگی‌ها</TabsTrigger>
                            <TabsTrigger value="reviews">نظرات ({product.reviews_count})</TabsTrigger>
                        </TabsList>
                        
                        <CardContent className="pt-6">
                            <TabsContent value="description" className="mt-0">
                                <div className="prose prose-gray max-w-none">
                                    <p className="text-gray-700 leading-relaxed text-justify">
                                        {product.description}
                                    </p>
                                </div>
                            </TabsContent>
                            
                            <TabsContent value="specifications" className="mt-0">
                                <div className="grid gap-4">
                                    {Object.entries(product.specifications).map(([key, value]) => (
                                        <div key={key} className="flex justify-between py-3 border-b border-gray-100 last:border-0">
                                            <span className="font-medium text-gray-900">{key}:</span>
                                            <span className="text-gray-700">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>
                            
                            <TabsContent value="features" className="mt-0">
                                <div className="space-y-3">
                                    {(showAllFeatures ? product.features : product.features.slice(0, 5)).map((feature, index) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-700">{feature}</span>
                                        </div>
                                    ))}
                                    
                                    {product.features.length > 5 && (
                                        <Button 
                                            variant="link" 
                                            onClick={() => setShowAllFeatures(!showAllFeatures)}
                                            className="p-0 h-auto text-green-600"
                                        >
                                            {showAllFeatures ? 'نمایش کمتر' : `نمایش ${product.features.length - 5} ویژگی دیگر`}
                                        </Button>
                                    )}
                                </div>
                            </TabsContent>
                            
                            <TabsContent value="reviews" className="mt-0">
                                <div className="space-y-6">
                                    {/* Rating Summary */}
                                    <div className="bg-gray-50 rounded-lg p-6">
                                        <div className="flex items-center gap-6 mb-4">
                                            <div className="text-center">
                                                <div className="text-4xl font-bold text-gray-900 mb-1">
                                                    {product.rating}
                                                </div>
                                                {renderStars(product.rating, 'lg')}
                                                <div className="text-sm text-gray-600 mt-1">
                                                    از {product.reviews_count} نظر
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                {[5, 4, 3, 2, 1].map((star) => {
                                                    const count = Math.floor(Math.random() * 50) + 1;
                                                    const percentage = (count / product.reviews_count) * 100;
                                                    return (
                                                        <div key={star} className="flex items-center gap-3 mb-2">
                                                            <span className="text-sm w-8">{star} ستاره</span>
                                                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                                <div 
                                                                    className="bg-yellow-400 h-2 rounded-full" 
                                                                    style={{ width: `${percentage}%` }}
                                                                />
                                                            </div>
                                                            <span className="text-sm text-gray-600 w-8">{count}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Reviews List */}
                                    <div className="space-y-6">
                                        {(showAllReviews ? product.reviews : product.reviews.slice(0, 3)).map((review) => (
                                            <Card key={review.id}>
                                                <CardContent className="p-6">
                                                    <div className="flex items-start gap-4">
                                                        <Avatar>
                                                            <AvatarImage src={review.avatar || undefined} />
                                                            <AvatarFallback>
                                                                {review.user_name.charAt(0)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <span className="font-medium text-gray-900">
                                                                    {review.user_name}
                                                                </span>
                                                                {review.verified_purchase && (
                                                                    <Badge variant="outline" className="text-green-600 border-green-600">
                                                                        <CheckCircle className="w-3 h-3 ml-1" />
                                                                        خریدار
                                                                    </Badge>
                                                                )}
                                                                <span className="text-sm text-gray-500">
                                                                    {review.date}
                                                                </span>
                                                            </div>
                                                            
                                                            <div className="flex items-center gap-2 mb-3">
                                                                {renderStars(review.rating, 'sm')}
                                                                <span className="font-medium text-gray-900">
                                                                    {review.title}
                                                                </span>
                                                            </div>
                                                            
                                                            <p className="text-gray-700 leading-relaxed mb-3">
                                                                {review.comment}
                                                            </p>
                                                            
                                                            <div className="flex items-center gap-4">
                                                                <Button 
                                                                    variant="ghost" 
                                                                    size="sm"
                                                                    onClick={() => handleReviewHelpful(review.id)}
                                                                    className={helpfulReviews.includes(review.id) ? 'text-green-600' : ''}
                                                                >
                                                                    <ThumbsUp className="w-4 h-4 ml-1" />
                                                                    مفید ({review.helpful_count + (helpfulReviews.includes(review.id) ? 1 : 0)})
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                        
                                        {product.reviews.length > 3 && (
                                            <div className="text-center">
                                                <Button 
                                                    variant="outline"
                                                    onClick={() => setShowAllReviews(!showAllReviews)}
                                                >
                                                    {showAllReviews 
                                                        ? 'نمایش کمتر' 
                                                        : `نمایش ${product.reviews.length - 3} نظر دیگر`
                                                    }
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </TabsContent>
                        </CardContent>
                    </Tabs>
                </Card>

                {/* Related Products */}
                {product.related_products && product.related_products.length > 0 && (
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">محصولات مشابه</h2>
                            <Link href="/products" className="text-green-600 hover:text-green-700 font-medium">
                                مشاهده همه
                            </Link>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {product.related_products.map((relatedProduct) => (
                                <ProductCard 
                                    key={relatedProduct.id}
                                    product={{
                                        ...relatedProduct,
                                        description: '',
                                        brand: '',
                                        stock: 10,
                                        rating: 4.5,
                                        reviews_count: 25
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
            
            <Footer />
        </>
    );
}