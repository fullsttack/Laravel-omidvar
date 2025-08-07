import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
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
    ShoppingBag
} from 'lucide-react';

export default function SiteHeader() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            {/* Top Banner */}
            <div className='flex item-center justify-center w-full p-2 bg-light '>
                <p className=''>
                    همراه با امیدوار محصولات پر تخفیف را تجربه کنید
                </p>
            </div>

            {/* Main Header */}
            <header className="bg-background sticky top-0 z-50 mt-6">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <div className="w-24">
                            <Link href="/" className="">
                                <img src='/images/1.gif' alt="لوگو" />
                            </Link>
                        </div>

                        {/* Search Bar */}
                        <div className="flex-1 max-w-xl mx-8 hidden md:block">
                            <div className="relative">
                                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                    type="text"
                                    placeholder="نام محصول، دسته بندی..."
                                    className="w-full pr-12 pl-4 h-12 text-right border-2 border-muted focus:border-primary"
                                />
                            </div>
                        </div>

                        {/* User Actions */}
                        <div className="flex items-center gap-4">
                            {auth.user ? (
                                <div className="flex items-center gap-4">
                                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                                        <Heart className="h-4 w-4" />
                                        <span className="hidden lg:inline">علاقه‌مندی‌ها</span>
                                    </Button>

                                    <Button variant="ghost" size="sm" className="flex items-center gap-2 relative">
                                        <ShoppingCart className="h-4 w-4" />
                                        <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                                            3
                                        </Badge>
                                        <span className="hidden lg:inline">سبد خرید</span>
                                    </Button>

                                    <Separator orientation="vertical" className="h-6" />

                                    <Button asChild variant="outline">
                                        <Link href={route('dashboard')} className="flex items-center gap-2">
                                            <User className="h-4 w-4" />
                                            <span>داشبورد</span>
                                        </Link>
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" className="border rounded-lg flex items-center gap-2">
                                        <Bell className="text-green" />
                                    </Button>

                                    <Button variant="ghost" className="border rounded-lg flex items-center gap-2">
                                        <Heart className="text-green" />
                                    </Button>

                                    <Button variant="ghost" className="border rounded-lg flex items-center gap-2">
                                        <ShoppingBag className="text-green" />
                                    </Button>

                                    <Separator orientation="vertical" className="h-6" />

                                    <Link href={route('login')} className="flex gap-2 p-2 px-4 text-sm rounded-lg item-center bg-green hover:bg-green-800 hover:text-white text-white">
                                        <User className="h-4 w-4" />
                                        <span>ورود / ثبت نام</span>
                                    </Link>
                                </div>
                            )}

                            <Button variant="ghost" size="sm" className="md:hidden">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Navigation Menu */}
            <nav className="bg-background border-b border-gray-200">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-14">
                        <div className="flex items-center gap-8">
                            <MegaMenu />

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

                        <div className='flex gap-4 items-center'>
                            <p className='text-xs text-gray-500'>هفت روز هفته، 24 ساعت شبانه‌ روز</p>
                            <p className='text-orange text-sm'>021-445566</p>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}