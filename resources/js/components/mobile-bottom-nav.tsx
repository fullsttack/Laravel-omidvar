import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';
import {
    Home,
    Search,
    Grid3X3,
    ShoppingCart,
    User
} from 'lucide-react';

export default function MobileBottomNav() {
    const { auth, ziggy } = usePage<SharedData>().props;
    const currentRoute = ziggy.location;

    const navItems = [
        {
            icon: Home,
            label: 'خانه',
            href: route('home'),
            active: currentRoute === route('home')
        },
        {
            icon: Search,
            label: 'جستجو',
            href: '#search',
            active: false
        },
        {
            icon: Grid3X3,
            label: 'دسته‌بندی',
            href: '#categories',
            active: false
        },
        {
            icon: ShoppingCart,
            label: 'سبد خرید',
            href: '#cart',
            active: false,
            badge: 3
        },
        {
            icon: User,
            label: auth.user ? 'حساب من' : 'ورود',
            href: auth.user ? route('admin.dashboard') : route('login'),
            active: currentRoute === (auth.user ? route('admin.dashboard') : route('login'))
        }
    ];

    return (
        <div className="md:hidden fixed bottom-4 left-4 right-4 z-50">
            <div className="bg-black/90 backdrop-blur-lg rounded-2xl px-4 py-2 shadow-2xl border border-white/10">
                <div className="flex items-center justify-around">
                    {navItems.map((item, index) => {
                        const IconComponent = item.icon;
                        const isActive = item.active;
                        
                        return (
                            <Link
                                key={index}
                                href={item.href}
                                className="group relative flex flex-col items-center justify-center py-2 px-3 min-w-[60px]"
                            >
                                <div className="relative">
                                    {isActive && (
                                        <div className="absolute inset-0 rounded-full scale-110"></div>
                                    )}
                                    
                                    <div className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                                        isActive 
                                            ? 'bg-green text-green shadow-lg' 
                                            : 'group-hover:bg-white/10 group-active:bg-white/20'
                                    }`}>
                                        <IconComponent className={`h-4 w-4 transition-colors duration-300 ${
                                            isActive ? 'text-white' : 'text-white/80 group-hover:text-white'
                                        }`} />
                                        
                                        {item.badge && (
                                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                                                <span className="text-white text-xs font-bold">{item.badge}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                               
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}