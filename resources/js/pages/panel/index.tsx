import React from 'react';
import { Head } from '@inertiajs/react';
import PanelLayout from '@/Layouts/PanelLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
    ShoppingBag, 
    CreditCard, 
    Heart, 
    MessageCircle,
    TrendingUp,
    Package,
    Users,
    Star
} from 'lucide-react';

export default function PanelIndex() {
    const stats = [
        {
            title: 'سفارش‌های فعال',
            value: '3',
            icon: ShoppingBag,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50'
        },
        {
            title: 'مجموع خریدها',
            value: '1,250,000 تومان',
            icon: CreditCard,
            color: 'text-green-600',
            bgColor: 'bg-green-50'
        },
        {
            title: 'علاقه‌مندی‌ها',
            value: '12',
            icon: Heart,
            color: 'text-red-600',
            bgColor: 'bg-red-50'
        },
        {
            title: 'نظرات شما',
            value: '8',
            icon: MessageCircle,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50'
        }
    ];

    const recentOrders = [
        {
            id: '#12345',
            date: '1403/05/15',
            status: 'در حال پردازش',
            amount: '150,000 تومان',
            statusColor: 'text-yellow-600 bg-yellow-50'
        },
        {
            id: '#12344',
            date: '1403/05/10',
            status: 'تحویل داده شده',
            amount: '89,000 تومان',
            statusColor: 'text-green-600 bg-green-50'
        },
        {
            id: '#12343',
            date: '1403/05/05',
            status: 'لغو شده',
            amount: '200,000 تومان',
            statusColor: 'text-red-600 bg-red-50'
        }
    ];

    return (
        <PanelLayout>
            <Head title="داشبورد - پنل کاربری" />
            
            <div className="space-y-8">
                {/* Page Header */}
                <div className="bg-white rounded-xl p-6 shadow-sm border">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">داشبورد</h1>
                    <p className="text-gray-600">خوش آمدید! خلاصه‌ای از فعالیت‌های اخیر شما</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {stats.map((stat) => {
                        const IconComponent = stat.icon;
                        return (
                            <div key={stat.title} className="bg-white rounded-xl p-6 shadow-sm border">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                                        <IconComponent className={`h-6 w-6 ${stat.color}`} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 mb-1">
                                            {stat.title}
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {stat.value}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-xl shadow-sm border">
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">سفارش‌های اخیر</h3>
                            <a href={route('panel.orders')} className="text-sm text-green-600 hover:text-green-700 font-medium">
                                مشاهده همه ←
                            </a>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {recentOrders.map((order) => (
                                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                                            <ShoppingBag className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{order.id}</p>
                                            <p className="text-sm text-gray-600">{order.date}</p>
                                        </div>
                                    </div>
                                    <div className="text-left">
                                        <p className="font-semibold text-gray-900 mb-1">{order.amount}</p>
                                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${order.statusColor}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </PanelLayout>
    );
}