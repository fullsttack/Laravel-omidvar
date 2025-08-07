import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';
import {
    Home,
    Grid3X3,
    Store,
    ShoppingCart,
    User
} from 'lucide-react';

export default function MobileBottomNav() {
    const { auth, ziggy } = usePage<SharedData>().props;
    const currentRoute = ziggy.location;

    const navItems = [
        {
            icon: Home,
            href: route('home'),
            active: currentRoute === route('home')
        },
        {
            icon: Grid3X3,
            href: '#categories',
            active: false
        },
        {
            icon: Store,
            href: '#shop',
            active: false
        },
        {
            icon: ShoppingCart,
            href: '#cart',
            active: false,
            badge: 3
        },
        {
            icon: User,
            href: auth.user ? route('dashboard') : route('login'),
            active: currentRoute === (auth.user ? route('dashboard') : route('login'))
        }
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
            <div className="flex items-center justify-around px-2 py-3">
                {navItems.map((item, index) => {
                    const IconComponent = item.icon;
                    const isActive = item.active;
                    
                    return (
                        <Link
                            key={index}
                            href={item.href}
                            className="flex flex-col items-center justify-center p-2 group min-w-[60px]"
                        >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 relative ${
                                isActive 
                                    ? 'bg-green-600' 
                                    : 'bg-gray-100 group-hover:bg-green-100'
                            }`}>
                                <IconComponent className={`h-5 w-5 transition-colors ${
                                    isActive ? 'text-white' : 'text-gray-600 group-hover:text-green-600'
                                }`} />
                                {item.badge && (
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-xs font-bold">{item.badge}</span>
                                    </div>
                                )}
                            </div>
                            <span className={`text-xs mt-1 font-medium transition-colors ${
                                isActive ? 'text-green-600' : 'text-gray-500'
                            }`}>
                               
                            </span>
                        </Link>
                    );
                })}
            </div>
            
            {/* Safe area */}
            <div className="h-safe-area-inset-bottom bg-white"></div>
        </div>
    );
}