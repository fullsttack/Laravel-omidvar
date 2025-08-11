import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { 
    User, 
    MapPin, 
    ShoppingBag, 
    CreditCard, 
    Heart, 
    MessageCircle, 
    Headphones,
    Home
} from 'lucide-react';

interface MenuItem {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    active?: boolean;
}

export default function PanelSidebar() {
    const { url } = usePage();

    const menuItems: MenuItem[] = [
        {
            name: 'داشبورد',
            href: route('panel.index'),
            icon: Home,
            active: url === '/panel'
        },
        {
            name: 'پروفایل',
            href: route('panel.profile'),
            icon: User,
            active: url === '/panel/profile'
        },
        {
            name: 'آدرس‌ها',
            href: route('panel.addresses'),
            icon: MapPin,
            active: url === '/panel/addresses'
        },
        {
            name: 'سفارش‌ها',
            href: route('panel.orders'),
            icon: ShoppingBag,
            active: url === '/panel/orders'
        },
        {
            name: 'تراکنش‌ها',
            href: route('panel.transactions'),
            icon: CreditCard,
            active: url === '/panel/transactions'
        },
        {
            name: 'لیست‌ها',
            href: route('panel.lists'),
            icon: Heart,
            active: url === '/panel/lists'
        },
        {
            name: 'کامنت‌ها',
            href: route('panel.comments.index'),
            icon: MessageCircle,
            active: url.startsWith('/panel/comments')
        },
        {
            name: 'تیکت‌ها',
            href: route('panel.tickets'),
            icon: Headphones,
            active: url === '/panel/tickets'
        }
    ];

    return (
        <div className="space-y-6">
          

            {/* Navigation Menu */}
            <div className="bg-white rounded-xl shadow-sm border">
                <div className="p-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-4">منوی پنل</h4>
                    <nav className="space-y-1">
                        {menuItems.map((item) => {
                            const IconComponent = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 text-sm rounded-lg transition-colors",
                                        item.active
                                            ? "bg-green-50 text-green-700 border-r-2 border-green-500"
                                            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                                    )}
                                >
                                    <IconComponent className={cn(
                                        "h-4 w-4 flex-shrink-0",
                                        item.active ? "text-green-600" : "text-gray-500"
                                    )} />
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </div>


            {/* Support */}
            <div className="bg-gradient-to-r from-green-500 to-green-700 rounded-xl p-4 text-white">
                <div className="flex items-center gap-3 mb-3">
                    <Headphones className="h-5 w-5" />
                    <h4 className="font-medium">پشتیبانی</h4>
                </div>
                <p className="text-sm text-gray-100 mb-4">
                    سوال یا مشکلی دارید؟ ما اینجا هستیم تا کمکتان کنیم
                </p>
                <Link
                    href={route('panel.tickets')}
                    className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                   021-224455
                </Link>
            </div>
        </div>
    );
}