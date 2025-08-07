import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import MegaMenu from '@/components/mega-menu';
import {
    Search,
    ShoppingCart,
    User,
    Heart,
    ChevronDown,
    Menu,
    Bell,
    ShoppingBag,
    Home,
    Store,
    Phone,
    Info
} from 'lucide-react';

export default function SiteHeader() {
    const { auth } = usePage<SharedData>().props;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const menuItems = [
        { icon: Home, label: 'صفحه اصلی', href: route('home') },
        { icon: Store, label: 'فروشگاه', href: '#shop' },
        { icon: Info, label: 'درباره ما', href: '#about' },
        { icon: Phone, label: 'تماس با ما', href: '#contact' }
    ];

    return (
        <>
            {/* Top Banner */}
            <div className='flex item-center justify-center w-full p-2 bg-light '>
                <p className='text-gray-500 text-xs sm:text-sm'>
                    همراه با امیدوار محصولات پر تخفیف را تجربه کنید
                </p>
            </div>

            {/* Main Header */}
            <header className=" top-0 z-50 mt-4">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16 md:h-20">
                        {/* Mobile Header Layout */}
                        <div className="flex items-center justify-between w-full md:hidden">
                            {/* Logo */}
                            <div className="w-24">
                                <Link href="/">
                                    <img src='/images/1.gif' alt="لوگو" className="w-full h-auto" />
                                </Link>
                            </div>

                            {/* Mobile Actions */}
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" className="w-9 h-9 hover:bg-gray-100">
                                    <Search className="h-4 w-4 text-gray-600" />
                                </Button>
                                <Button variant="ghost" size="icon" className="w-9 h-9 hover:bg-gray-100 relative">
                                    <Bell className="h-4 w-4 text-gray-600" />
                                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                                        2
                                    </span>
                                </Button>
                                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                                    <SheetTrigger asChild>
                                        <Button variant="ghost" size="icon" className="w-9 h-9 hover:bg-gray-100">
                                            <Menu className="h-4 w-4 text-gray-600" />
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent side="right" className="w-full p-0">
                                        {/* Mobile Menu Header */}
                                        <div className="flex items-center justify-between p-4 border-b bg-green-600 text-white">
                                            <div className="flex items-center gap-3">
                                                <img src='/images/1.gif' alt="لوگو" className="w-8 h-auto" />
                                                <div>
                                                    <h2 className="font-bold">فروشگاه امیدوار</h2>
                                                    <p className="text-sm opacity-90">خشکبار و مواد غذایی</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Mobile Menu Content */}
                                        <div className="p-4 space-y-6">
                                            {/* User Section */}
                                            <div className="pb-4 border-b">
                                                {auth.user ? (
                                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                                                            <User className="h-5 w-5 text-white" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900">حساب کاربری</p>
                                                            <p className="text-sm text-gray-600">خوش آمدید</p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <Link 
                                                        href={route('login')}
                                                        className="flex items-center gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                    >
                                                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                                                            <User className="h-5 w-5 text-white" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900">ورود / ثبت نام</p>
                                                            <p className="text-sm text-gray-600">وارد حساب کاربری شوید</p>
                                                        </div>
                                                    </Link>
                                                )}
                                            </div>

                                            {/* Main Menu Items */}
                                            <div className="space-y-2">
                                                <h3 className="font-semibold text-gray-900 mb-3">منوی اصلی</h3>
                                                {menuItems.map((item, index) => {
                                                    const IconComponent = item.icon;
                                                    return (
                                                        <Link
                                                            key={index}
                                                            href={item.href}
                                                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                                            onClick={() => setIsMobileMenuOpen(false)}
                                                        >
                                                            <IconComponent className="h-5 w-5 text-gray-600" />
                                                            <span className="text-gray-900">{item.label}</span>
                                                        </Link>
                                                    );
                                                })}
                                            </div>

                                            {/* Categories Section */}
                                            <div className="space-y-2">
                                                <h3 className="font-semibold text-gray-900 mb-3">دسته‌بندی محصولات</h3>
                                                <div className="lg:hidden">
                                                    <MegaMenu />
                                                </div>
                                            </div>

                                            {/* Quick Actions */}
                                            <div className="space-y-2 pt-4 border-t">
                                                <h3 className="font-semibold text-gray-900 mb-3">دسترسی سریع</h3>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <button className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                                        <Heart className="h-5 w-5 text-red-500" />
                                                        <span className="text-sm text-gray-700">علاقه‌مندی‌ها</span>
                                                    </button>
                                                    <button className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors relative">
                                                        <ShoppingCart className="h-5 w-5 text-green-600" />
                                                        <span className="text-sm text-gray-700">سبد خرید</span>
                                                        <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-green-500">
                                                            3
                                                        </Badge>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Contact Info */}
                                            <div className="pt-4 border-t">
                                                <h3 className="font-semibold text-gray-900 mb-3">تماس با ما</h3>
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                                        <Phone className="h-4 w-4" />
                                                        <span>۰۲۱-۴۴۵۵۶۶</span>
                                                    </div>
                                                    <p className="text-xs text-gray-500">هفت روز هفته، ۲۴ ساعت شبانه‌ روز</p>
                                                </div>
                                            </div>
                                        </div>
                                    </SheetContent>
                                </Sheet>
                            </div>
                        </div>

                        {/* Desktop Header Layout */}
                        <div className="hidden md:flex items-center justify-between w-full">
                            {/* Logo */}
                            <div className="w-20">
                                <Link href="/">
                                    <img src='/images/1.gif' alt="لوگو" className="w-full h-auto" />
                                </Link>
                            </div>

                            {/* Search Bar - Desktop */}
                            <div className="flex-1 max-w-xl mx-8">
                                <div className="relative">
                                    <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        type="text"
                                        placeholder="جستجو در محصولات..."
                                        className="w-full pr-12 pl-4 h-11 text-right border border-gray-300 rounded-xl focus:border-green-500 focus:ring-1 focus:ring-green-500 bg-gray-50 hover:bg-white transition-colors"
                                    />
                                </div>
                            </div>

                            {/* User Actions - Desktop */}
                            <div className="flex items-center gap-3">
                                {auth.user ? (
                                    <div className="flex items-center gap-3">
                                        <Button variant="ghost" size="sm" className="flex items-center gap-2 hover:bg-gray-100 rounded-xl">
                                            <Heart className="h-4 w-4 text-gray-600" />
                                            <span className="hidden lg:inline text-gray-700">علاقه‌مندی‌ها</span>
                                        </Button>

                                        <Button variant="ghost" size="sm" className="flex items-center gap-2 relative hover:bg-gray-100 rounded-xl">
                                            <ShoppingCart className="h-4 w-4 text-gray-600" />
                                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                                                3
                                            </span>
                                            <span className="hidden lg:inline text-gray-700">سبد خرید</span>
                                        </Button>

                                        <Separator orientation="vertical" className="h-6 bg-gray-300" />

                                        <Button asChild variant="outline" className="border-gray-300 hover:bg-gray-50 rounded-xl">
                                            <Link href={route('dashboard')} className="flex items-center gap-2">
                                                <User className="h-4 w-4 text-gray-600" />
                                                <span className="text-gray-700">داشبورد</span>
                                            </Link>
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <Button variant="ghost" className="w-10 h-10 rounded-xl border border-gray-200 hover:bg-gray-50 relative">
                                            <Bell className="text-gray-600 h-4 w-4" />
                                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                                                2
                                            </span>
                                        </Button>

                                        <Button variant="ghost" className="w-10 h-10 rounded-xl border border-gray-200 hover:bg-gray-50">
                                            <Heart className="text-gray-600 h-4 w-4" />
                                        </Button>

                                        <Button variant="ghost" className="w-10 h-10 rounded-xl border border-gray-200 hover:bg-gray-50">
                                            <ShoppingBag className="text-gray-600 h-4 w-4" />
                                        </Button>

                                        <Separator orientation="vertical" className="h-6 bg-gray-300" />
                                        
                                        <Link href={route('login')} className="flex items-center gap-2 px-4 py-2 text-sm rounded-xl bg-green-600 hover:bg-green-700 text-white transition-colors font-medium">
                                            <User className="h-4 w-4" />
                                            <span>ورود / ثبت نام</span>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Navigation Menu */}
            <nav className="bg-background">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-8">
                            <div className="hidden md:block">
                                <MegaMenu />
                            </div>

                            <div className="hidden lg:flex items-center gap-6">
                                <Link href="#" className="text-sm hover:text-primary transition-colors">
                                    صفحه اصلی
                                </Link>
                                <Link href="#" className="text-sm hover:text-primary transition-colors flex items-center gap-1">
                                    فروشگاه
                                    <ChevronDown className="h-3 w-3" />
                                </Link>
                                <Link href="#" className="text-sm hover:text-primary transition-colors">
                                    انواع محصولات محصول
                                </Link>
                                <Link href="#" className="text-sm hover:text-primary transition-colors">
                                    درباره ما
                                </Link>
                                <Link href="#" className="text-sm hover:text-primary transition-colors">
                                    تماس با ما
                                </Link>
                            </div>
                        </div>

                        <div className='hidden md:flex gap-4 items-center'>
                            <p className='text-xs text-gray-500 hidden lg:block'>هفت روز هفته، 24 ساعت شبانه‌ روز</p>
                            <p className='text-orange text-sm'>021-445566</p>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}