import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Link } from '@inertiajs/react';
import {
    ChevronDown,
    Menu,
    Wheat,
    Apple,
    Cookie,
    Coffee,
    Grape,
    ChefHat,
    Soup,
    Gift,
    ArrowLeft,
    Star
} from 'lucide-react';

interface SubCategory {
    id: number;
    name: string;
    items: string[];
    featured?: boolean;
}

interface Category {
    id: number;
    name: string;
    icon: React.ComponentType<{ className?: string }>;
    subcategories: SubCategory[];
}

const categories: Category[] = [
    {
        id: 1,
        name: 'برنج و حبوبات',
        icon: Wheat,
        subcategories: [
            {
                id: 11,
                name: 'انواع برنج',
                items: ['برنج هاشمی', 'برنج دم سیاه', 'برنج طارم', 'برنج هندی', 'برنج قهوه‌ای'],
                featured: true
            },
            {
                id: 12,
                name: 'حبوبات',
                items: ['عدس قرمز', 'عدس سبز', 'لوبیا چیتی', 'لوبیا قرمز', 'نخود', 'لپه']
            },
            {
                id: 13,
                name: 'غلات و دانه‌ها',
                items: ['جو پرک', 'بلغور', 'کینوا', 'چیا سیدز', 'بذر کتان']
            }
        ]
    },
    {
        id: 2,
        name: 'خشکبار و آجیل',
        icon: Apple,
        subcategories: [
            {
                id: 21,
                name: 'میوه خشک',
                items: ['کشمش', 'خرما', 'آلو', 'زردآلو', 'انجیر خشک', 'توت خشک'],
                featured: true
            },
            {
                id: 22,
                name: 'آجیل و مغزها',
                items: ['بادام', 'گردو', 'پسته', 'فندق', 'بادام زمینی', 'کاجو']
            },
            {
                id: 23,
                name: 'میکس آجیل',
                items: ['میکس مهمانی', 'میکس ورزشی', 'میکس دانشجویی', 'میکس لاکچری']
            }
        ]
    },
    {
        id: 3,
        name: 'شیرینی و تنقلات',
        icon: Cookie,
        subcategories: [
            {
                id: 31,
                name: 'شیرینی خشک',
                items: ['باقلوا', 'شیرینی نخودچی', 'کوکی', 'بیسکوییت', 'نان برنجی'],
                featured: true
            },
            {
                id: 32,
                name: 'شکلات و آبنبات',
                items: ['شکلات تلخ', 'شکلات شیری', 'آبنبات', 'نوقا', 'کاراملا']
            },
            {
                id: 33,
                name: 'حلوا و شیرینی سنتی',
                items: ['حلوا ارده', 'سوهان', 'گز اصفهان', 'باسلوق', 'فالوده خشک']
            }
        ]
    },
    {
        id: 4,
        name: 'چای و قهوه',
        icon: Coffee,
        subcategories: [
            {
                id: 41,
                name: 'انواع چای',
                items: ['چای احمد', 'چای سیلان', 'چای سبز', 'چای کیسه‌ای', 'دمنوش'],
                featured: true
            },
            {
                id: 42,
                name: 'قهوه',
                items: ['قهوه ترک', 'اسپرسو', 'قهوه فوری', 'قهوه سبز', 'کاپوچینو']
            },
            {
                id: 43,
                name: 'دمنوش و چای گیاهی',
                items: ['دمنوش بابونه', 'چای سبز', 'دمنوش زنجبیل', 'چای ترش', 'دمنوش نعنا']
            }
        ]
    },
    {
        id: 5,
        name: 'ادویه و چاشنی',
        icon: ChefHat,
        subcategories: [
            {
                id: 51,
                name: 'ادویه‌های اصلی',
                items: ['زردچوبه', 'دارچین', 'زعفران', 'فلفل سیاه', 'زیره', 'کاری'],
                featured: true
            },
            {
                id: 52,
                name: 'چاشنی و طعم‌دهنده',
                items: ['نمک دریا', 'سرکه', 'روغن زیتون', 'عسل طبیعی', 'سس‌ها']
            },
            {
                id: 53,
                name: 'ادویه مخلوط',
                items: ['ادویه قورمه', 'ادویه پلو', 'ادویه کباب', 'ادویه فلفل دلمه']
            }
        ]
    },
    {
        id: 6,
        name: 'کنسرو و آماده',
        icon: Soup,
        subcategories: [
            {
                id: 61,
                name: 'کنسرو ماهی',
                items: ['تن ماهی', 'کیلکا', 'ساردین', 'ماهی قزل آلا'],
                featured: true
            },
            {
                id: 62,
                name: 'رب و سس',
                items: ['رب گوجه', 'سس مایونز', 'کچاپ', 'سس پستو', 'سس سویا']
            },
            {
                id: 63,
                name: 'آماده و نیمه آماده',
                items: ['سوپ آماده', 'خورشت آماده', 'برنج آماده', 'فلافل میکس']
            }
        ]
    }
];

export default function MegaMenu() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [hoveredCategory, setHoveredCategory] = useState<number>(1); // Default to first category

    return (
        <>
            {/* Desktop Mega Menu */}
            <div className="hidden lg:block relative">
                <div
                    className="relative"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <Button 
                        variant="ghost" 
                        className="flex items-center gap-2 h-11 px-4 font-medium hover:bg-accent"
                    >
                        <Menu className="h-4 w-4" />
                        <span>دسته‌بندی محصولات</span>
                        <ChevronDown className={`h-4 w-4 transition-transform ${isHovered ? 'rotate-180' : ''}`} />
                    </Button>

                    {/* Mega Menu Content */}
                    {isHovered && (
                        <div className="absolute top-full right-0 w-screen max-w-5xl bg-white border border-gray-200 shadow-2xl rounded-lg z-50 overflow-hidden">
                            <div className="grid grid-cols-12">
                                {/* Categories Sidebar */}
                                <div className="col-span-4 bg-gray-50 border-l p-6">
                                    <h3 className="font-bold text-lg mb-4 text-gray-800">دسته‌بندی‌ها</h3>
                                    <div className="space-y-1">
                                        {categories.map((category) => {
                                            const IconComponent = category.icon;
                                            return (
                                                <div
                                                    key={category.id}
                                                    onMouseEnter={() => setHoveredCategory(category.id)}
                                                    className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 cursor-pointer group ${
                                                        hoveredCategory === category.id 
                                                            ? 'bg-white shadow-md border border-gray-200' 
                                                            : 'hover:bg-white/50'
                                                    }`}
                                                >
                                                    <IconComponent className={`h-5 w-5 transition-colors ${
                                                        hoveredCategory === category.id 
                                                            ? 'text-primary' 
                                                            : 'text-gray-600 group-hover:text-primary'
                                                    }`} />
                                                    <span className={`font-medium text-sm transition-colors ${
                                                        hoveredCategory === category.id 
                                                            ? 'text-primary' 
                                                            : 'text-gray-800 group-hover:text-primary'
                                                    }`}>
                                                        {category.name}
                                                    </span>
                                                    <ArrowLeft className={`h-4 w-4 mr-auto transition-colors ${
                                                        hoveredCategory === category.id 
                                                            ? 'text-primary' 
                                                            : 'text-gray-400 group-hover:text-primary'
                                                    }`} />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Dynamic Content Area */}
                                <div className="col-span-8 bg-white">
                                    {(() => {
                                        const currentCategory = categories.find(cat => cat.id === hoveredCategory);
                                        if (!currentCategory) return null;
                                        
                                        const IconComponent = currentCategory.icon;
                                        
                                        return (
                                            <div className="p-6">
                                                {/* Category Header */}
                                                <div className="border-b pb-4 mb-6">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <IconComponent className="h-6 w-6 text-primary" />
                                                        <h4 className="text-xl font-bold text-gray-800">
                                                            {currentCategory.name}
                                                        </h4>
                                                    </div>
                                                    <p className="text-sm text-gray-600">
                                                        بهترین محصولات {currentCategory.name} با کیفیت برتر
                                                    </p>
                                                </div>

                                                {/* Subcategories Grid */}
                                                <div className="grid grid-cols-3 gap-6">
                                                    {currentCategory.subcategories.map((subcategory) => (
                                                        <div key={subcategory.id} className="space-y-3">
                                                            <div className="flex items-center gap-2 mb-3">
                                                                <h5 className="font-semibold text-gray-800">
                                                                    {subcategory.name}
                                                                </h5>
                                                                {subcategory.featured && (
                                                                    <Badge className="bg-orange-100 text-orange-800 border-orange-300 text-xs px-2 py-0.5">
                                                                        <Star className="h-3 w-3 mr-1" />
                                                                        پرفروش
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <ul className="space-y-2">
                                                                {subcategory.items.map((item, index) => (
                                                                    <li key={index}>
                                                                        <Link
                                                                            href="#"
                                                                            className="block text-sm text-gray-600 hover:text-primary hover:bg-gray-50 transition-colors py-1.5 px-2 rounded"
                                                                        >
                                                                            {item}
                                                                        </Link>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                            <Link
                                                                href="#"
                                                                className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium mt-2"
                                                            >
                                                                مشاهده همه
                                                                <ArrowLeft className="h-3 w-3" />
                                                            </Link>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Category Footer */}
                                                <div className="mt-8 pt-4 border-t bg-gradient-to-l from-gray-50 to-white p-4 rounded-lg">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                                                                <Gift className="h-5 w-5 text-primary" />
                                                            </div>
                                                            <div>
                                                                <h4 className="font-bold text-gray-800 text-sm mb-1">
                                                                    پیشنهادات ویژه {currentCategory.name}
                                                                </h4>
                                                                <p className="text-xs text-gray-600">
                                                                    تخفیف‌های ویژه محصولات این دسته‌بندی
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <Button size="sm" className="bg-primary hover:bg-primary/90">
                                                            مشاهده تخفیف‌ها
                                                            <ArrowLeft className="h-3 w-3 mr-2" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Menu */}
            <div className="lg:hidden">
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" className="flex items-center gap-2">
                            <Menu className="h-4 w-4" />
                            <span>دسته‌بندی محصولات</span>
                            <ChevronDown className="h-4 w-4" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-full sm:w-96 overflow-y-auto p-0">
                        {/* Mobile Header */}
                        <div className="sticky top-0 bg-white border-b p-6 z-10">
                            <h2 className="text-xl font-bold text-gray-800">فروشگاه خشکبار و برنج</h2>
                            <p className="text-sm text-gray-600 mt-1">انتخاب از بهترین محصولات طبیعی</p>
                        </div>

                        {/* Mobile Categories */}
                        <div className="p-6 space-y-6">
                            {categories.map((category) => {
                                const IconComponent = category.icon;
                                return (
                                    <div key={category.id} className="space-y-4">
                                        {/* Category Header */}
                                        <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border">
                                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white">
                                                <IconComponent className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-800">{category.name}</h3>
                                                <p className="text-xs text-gray-600">
                                                    {category.subcategories.length} دسته‌بندی
                                                </p>
                                            </div>
                                        </div>

                                        {/* Mobile Subcategories */}
                                        <div className="space-y-4 pr-4">
                                            {category.subcategories.map((subcategory) => (
                                                <div key={subcategory.id} className="border-r-2 border-gray-200 pr-4">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <h4 className="font-semibold text-gray-800 text-sm">
                                                            {subcategory.name}
                                                        </h4>
                                                        {subcategory.featured && (
                                                            <Badge className="bg-orange-100 text-orange-800 border-orange-300 text-xs">
                                                                <Star className="h-3 w-3 mr-1" />
                                                                پرفروش
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <ul className="space-y-1">
                                                        {subcategory.items.slice(0, 4).map((item, index) => (
                                                            <li key={index}>
                                                                <Link
                                                                    href="#"
                                                                    className="block text-sm text-gray-600 hover:text-primary hover:bg-gray-50 transition-colors py-1.5 px-2 rounded"
                                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                                >
                                                                    {item}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                    <Link
                                                        href="#"
                                                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2"
                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                    >
                                                        مشاهده بیشتر
                                                        <ArrowLeft className="h-3 w-3" />
                                                    </Link>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Mobile Footer */}
                        <div className="sticky bottom-0 bg-gradient-to-r from-green-50 to-orange-50 p-6 border-t">
                            <div className="text-center">
                                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mx-auto mb-3">
                                    <Gift className="h-8 w-8 text-primary" />
                                </div>
                                <h4 className="font-bold text-gray-800 mb-2">محصولات ارگانیک</h4>
                                <p className="text-sm text-gray-600 mb-4">
                                    کیفیت تضمینی با بهترین قیمت‌ها
                                </p>
                                <Button 
                                    className="w-full bg-primary hover:bg-primary/90"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    مشاهده محصولات ویژه
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                </Button>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </>
    );
}