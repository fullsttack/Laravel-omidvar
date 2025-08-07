import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Star,
    ShoppingCart,
    Heart,
    Eye,
    Grid3X3,
    List,
    Filter,
    ArrowUpDown,
    ChevronDown,
    Search,
    X
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
    category: string;
    brand: string;
    inStock: boolean;
}

interface ProductsProps {
    products?: Product[];
    categories?: string[];
    brands?: string[];
}

const defaultProducts: Product[] = [
    {
        id: '1',
        name: 'برنج هاشمی درجه یک',
        price: 125000,
        originalPrice: 150000,
        image: '/images/product/1.webp',
        rating: 4.8,
        reviews: 156,
        badge: 'پرفروش',
        discount: 17,
        category: 'برنج و حبوبات',
        brand: 'امیدوار',
        inStock: true
    },
    {
        id: '2',
        name: 'زعفران نگین ۵ گرمی',
        price: 890000,
        image: '/images/product/2.webp',
        rating: 4.9,
        reviews: 89,
        badge: 'ممتاز',
        category: 'ادویه و چاشنی',
        brand: 'طلایی',
        inStock: true
    },
    {
        id: '3',
        name: 'خشکبار مخلوط پرمیوم',
        price: 285000,
        originalPrice: 320000,
        image: '/images/product/3.webp',
        rating: 4.7,
        reviews: 203,
        discount: 11,
        category: 'خشکبار و آجیل',
        brand: 'نوین',
        inStock: true
    },
    {
        id: '4',
        name: 'چای احمد کیسه‌ای',
        price: 45000,
        image: '/images/product/4.webp',
        rating: 4.6,
        reviews: 134,
        badge: 'جدید',
        category: 'چای و قهوه',
        brand: 'احمد',
        inStock: false
    },
    {
        id: '5',
        name: 'عسل طبیعی کوهستان',
        price: 180000,
        originalPrice: 200000,
        image: '/images/product/5.webp',
        rating: 4.8,
        reviews: 92,
        discount: 10,
        category: 'شیرینی و تنقلات',
        brand: 'طبیعت',
        inStock: true
    },
    {
        id: '6',
        name: 'کنسرو تن ماهی',
        price: 35000,
        image: '/images/product/6.webp',
        rating: 4.4,
        reviews: 76,
        category: 'کنسرو و آماده',
        brand: 'دریایی',
        inStock: true
    },
    {
        id: '7',
        name: 'روغن زیتون اکسترا',
        price: 220000,
        originalPrice: 250000,
        image: '/images/product/7.webp',
        rating: 4.7,
        reviews: 145,
        discount: 12,
        category: 'روغن و سرکه',
        brand: 'مدیترانه',
        inStock: true
    },
    {
        id: '8',
        name: 'پنیر سفید محلی',
        price: 85000,
        image: '/images/product/8.webp',
        rating: 4.5,
        reviews: 68,
        category: 'لبنیات تازه',
        brand: 'دامداری سبز',
        inStock: true
    }
];

const defaultCategories = ['همه', 'برنج و حبوبات', 'ادویه و چاشنی', 'خشکبار و آجیل', 'چای و قهوه', 'شیرینی و تنقلات', 'کنسرو و آماده', 'روغن و سرکه', 'لبنیات تازه'];
const defaultBrands = ['همه', 'امیدوار', 'طلایی', 'نوین', 'احمد', 'طبیعت', 'دریایی', 'مدیترانه', 'دامداری سبز'];

export default function Products({ 
    products = defaultProducts, 
    categories = defaultCategories, 
    brands = defaultBrands 
}: ProductsProps) {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState('popular');
    const [selectedCategory, setSelectedCategory] = useState('همه');
    const [selectedBrand, setSelectedBrand] = useState('همه');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
    const [showOnlyInStock, setShowOnlyInStock] = useState(false);
    const [showOnlyDiscounted, setShowOnlyDiscounted] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const formatPrice = (price: number) => {
        return price.toLocaleString('fa-IR');
    };

    const filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategory === 'همه' || product.category === selectedCategory;
        const matchesBrand = selectedBrand === 'همه' || product.brand === selectedBrand;
        const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
        const matchesStock = !showOnlyInStock || product.inStock;
        const matchesDiscount = !showOnlyDiscounted || product.discount;
        const matchesSearch = searchTerm === '' || product.name.toLowerCase().includes(searchTerm.toLowerCase());
        
        return matchesCategory && matchesBrand && matchesPrice && matchesStock && matchesDiscount && matchesSearch;
    });

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'rating':
                return b.rating - a.rating;
            case 'newest':
                return a.badge === 'جدید' ? -1 : b.badge === 'جدید' ? 1 : 0;
            default:
                return b.reviews - a.reviews;
        }
    });

    const clearFilters = () => {
        setSelectedCategory('همه');
        setSelectedBrand('همه');
        setPriceRange([0, 1000000]);
        setShowOnlyInStock(false);
        setShowOnlyDiscounted(false);
        setSearchTerm('');
    };

    const ProductCard = ({ product }: { product: Product }) => (
        <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100">
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
                    {!product.inStock && (
                        <Badge variant="destructive">
                            ناموجود
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
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
                    {product.name}
                </h3>

                <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium text-gray-700">{product.rating}</span>
                    </div>
                    <span className="text-xs text-gray-500">({product.reviews} نظر)</span>
                </div>

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

                <Button 
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    disabled={!product.inStock}
                >
                    <ShoppingCart className="h-4 w-4 ml-2" />
                    {product.inStock ? 'افزودن به سبد' : 'ناموجود'}
                </Button>
            </div>
        </div>
    );

    const ProductListItem = ({ product }: { product: Product }) => (
        <Card className="flex items-center p-4 hover:shadow-md transition-shadow">
            <div className="relative w-24 h-24 rounded-lg overflow-hidden ml-4">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                />
                {product.discount && (
                    <Badge className="absolute top-1 right-1 text-xs bg-red-500">
                        {product.discount}٪
                    </Badge>
                )}
            </div>

            <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{product.rating}</span>
                    </div>
                    <span className="text-sm text-gray-500">({product.reviews} نظر)</span>
                    <Badge variant="outline" className="text-xs">{product.category}</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-green-600">
                            {formatPrice(product.price)} تومان
                        </span>
                        {product.originalPrice && (
                            <span className="text-sm text-gray-400 line-through">
                                {formatPrice(product.originalPrice)} تومان
                            </span>
                        )}
                    </div>
                    
                    <Button 
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        disabled={!product.inStock}
                    >
                        <ShoppingCart className="h-4 w-4 ml-1" />
                        {product.inStock ? 'افزودن' : 'ناموجود'}
                    </Button>
                </div>
            </div>
        </Card>
    );

    return (
        <div className="py-8 bg-gray-50">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">محصولات</h1>
                        <p className="text-gray-600">
                            {sortedProducts.length} محصول یافت شد
                        </p>
                    </div>

                    {/* Search */}
                    <div className="relative mt-4 md:mt-0">
                        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="جستجو در محصولات..."
                            className="pl-4 pr-10 py-2 border rounded-lg w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                            >
                                <X className="h-4 w-4 text-gray-400" />
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Filters Sidebar */}
                    <div className="lg:w-64">
                        <Card className="p-4 sticky top-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-gray-900">فیلترها</h3>
                                <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={clearFilters}
                                    className="text-red-600 hover:text-red-700"
                                >
                                    پاک کردن
                                </Button>
                            </div>

                            <div className="space-y-6">
                                {/* Category Filter */}
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-3">دسته‌بندی</h4>
                                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category} value={category}>
                                                    {category}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Brand Filter */}
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-3">برند</h4>
                                    <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {brands.map((brand) => (
                                                <SelectItem key={brand} value={brand}>
                                                    {brand}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <Separator />

                                {/* Stock Filter */}
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="in-stock"
                                        checked={showOnlyInStock}
                                        onCheckedChange={setShowOnlyInStock}
                                    />
                                    <label htmlFor="in-stock" className="text-sm text-gray-700 pr-2">
                                        فقط کالاهای موجود
                                    </label>
                                </div>

                                {/* Discount Filter */}
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="discounted"
                                        checked={showOnlyDiscounted}
                                        onCheckedChange={setShowOnlyDiscounted}
                                    />
                                    <label htmlFor="discounted" className="text-sm text-gray-700 pr-2">
                                        فقط کالاهای تخفیف‌دار
                                    </label>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Products Content */}
                    <div className="flex-1">
                        {/* Toolbar */}
                        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-sm">
                            <div className="flex items-center gap-4">
                                {/* Sort */}
                                <div className="flex items-center gap-2">
                                    <ArrowUpDown className="h-4 w-4 text-gray-500" />
                                    <Select value={sortBy} onValueChange={setSortBy}>
                                        <SelectTrigger className="w-40">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="popular">محبوب‌ترین</SelectItem>
                                            <SelectItem value="newest">جدیدترین</SelectItem>
                                            <SelectItem value="price-low">ارزان‌ترین</SelectItem>
                                            <SelectItem value="price-high">گران‌ترین</SelectItem>
                                            <SelectItem value="rating">بالاترین امتیاز</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* View Mode */}
                            <div className="flex items-center gap-2 mt-4 sm:mt-0">
                                <Button
                                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setViewMode('grid')}
                                >
                                    <Grid3X3 className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant={viewMode === 'list' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setViewMode('list')}
                                >
                                    <List className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Products Grid/List */}
                        {sortedProducts.length > 0 ? (
                            viewMode === 'grid' ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {sortedProducts.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {sortedProducts.map((product) => (
                                        <ProductListItem key={product.id} product={product} />
                                    ))}
                                </div>
                            )
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">محصولی یافت نشد</h3>
                                <p className="text-gray-600 mb-4">لطفا فیلترهای خود را تغییر دهید</p>
                                <Button onClick={clearFilters} variant="outline">
                                    پاک کردن فیلترها
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}