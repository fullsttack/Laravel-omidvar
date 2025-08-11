import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import PanelLayout from '@/Layouts/PanelLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    ShoppingBag, 
    Package, 
    Truck, 
    CheckCircle, 
    XCircle,
    Clock,
    Eye,
    RotateCcw,
    Filter,
    Search
} from 'lucide-react';
import { Input } from '@/components/ui/input';

interface OrderItem {
    id: number;
    name: string;
    image: string;
    quantity: number;
    price: number;
}

interface Order {
    id: string;
    date: string;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    totalAmount: number;
    itemsCount: number;
    items: OrderItem[];
    trackingCode?: string;
    deliveryDate?: string;
}

export default function Orders() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    
    const [orders] = useState<Order[]>([
        {
            id: '#12345',
            date: '1403/05/15',
            status: 'processing',
            totalAmount: 150000,
            itemsCount: 3,
            items: [
                { id: 1, name: 'گوشی موبایل سامسونگ', image: '/images/product1.jpg', quantity: 1, price: 120000 },
                { id: 2, name: 'کیف چرمی', image: '/images/product2.jpg', quantity: 1, price: 25000 },
                { id: 3, name: 'شارژر فست', image: '/images/product3.jpg', quantity: 1, price: 5000 }
            ],
            trackingCode: 'TRK123456789'
        },
        {
            id: '#12344',
            date: '1403/05/10',
            status: 'delivered',
            totalAmount: 89000,
            itemsCount: 2,
            items: [
                { id: 4, name: 'هدفون بلوتوث', image: '/images/product4.jpg', quantity: 2, price: 89000 }
            ],
            trackingCode: 'TRK987654321',
            deliveryDate: '1403/05/12'
        },
        {
            id: '#12343',
            date: '1403/05/05',
            status: 'cancelled',
            totalAmount: 200000,
            itemsCount: 1,
            items: [
                { id: 5, name: 'لپ تاپ ایسوس', image: '/images/product5.jpg', quantity: 1, price: 200000 }
            ]
        },
        {
            id: '#12342',
            date: '1403/04/28',
            status: 'shipped',
            totalAmount: 75000,
            itemsCount: 4,
            items: [
                { id: 6, name: 'کتاب برنامه نویسی', image: '/images/product6.jpg', quantity: 2, price: 30000 },
                { id: 7, name: 'ماوس گیمینگ', image: '/images/product7.jpg', quantity: 1, price: 45000 }
            ],
            trackingCode: 'TRK555666777'
        }
    ]);

    const getStatusInfo = (status: Order['status']) => {
        const statusConfig = {
            pending: {
                label: 'در انتظار پردازش',
                color: 'bg-yellow-100 text-yellow-800',
                icon: Clock
            },
            processing: {
                label: 'در حال پردازش',
                color: 'bg-blue-100 text-blue-800',
                icon: Package
            },
            shipped: {
                label: 'ارسال شده',
                color: 'bg-purple-100 text-purple-800',
                icon: Truck
            },
            delivered: {
                label: 'تحویل داده شده',
                color: 'bg-green-100 text-green-800',
                icon: CheckCircle
            },
            cancelled: {
                label: 'لغو شده',
                color: 'bg-red-100 text-red-800',
                icon: XCircle
            }
        };
        return statusConfig[status];
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('fa-IR').format(price);
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            order.items.some(item => item.name.includes(searchTerm));
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <PanelLayout>
            <Head title="سفارش‌ها - پنل کاربری" />
            
            <div className="space-y-8">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">سفارش‌های من</h1>
                        <p className="text-gray-600">مشاهده و پیگیری تمام سفارش‌های شما</p>
                    </div>
                </div>

                {/* Filters */}
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    placeholder="جستجو در سفارش‌ها..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pr-10 text-right"
                                />
                            </div>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md text-right focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                            >
                                <option value="all">تمام وضعیت‌ها</option>
                                <option value="pending">در انتظار پردازش</option>
                                <option value="processing">در حال پردازش</option>
                                <option value="shipped">ارسال شده</option>
                                <option value="delivered">تحویل داده شده</option>
                                <option value="cancelled">لغو شده</option>
                            </select>
                        </div>
                    </CardContent>
                </Card>

                {/* Orders List */}
                <div className="space-y-6">
                    {filteredOrders.map((order) => {
                        const statusInfo = getStatusInfo(order.status);
                        const StatusIcon = statusInfo.icon;

                        return (
                            <Card key={order.id} className="border-0 shadow-sm">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div>
                                                <CardTitle className="text-lg">{order.id}</CardTitle>
                                                <p className="text-sm text-gray-600 mt-1">{order.date}</p>
                                            </div>
                                            <Badge className={`gap-1 ${statusInfo.color}`}>
                                                <StatusIcon className="h-3 w-3" />
                                                {statusInfo.label}
                                            </Badge>
                                        </div>
                                        <div className="text-left">
                                            <p className="text-lg font-bold text-gray-900">
                                                {formatPrice(order.totalAmount)} تومان
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {order.itemsCount} کالا
                                            </p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {/* Order Items */}
                                    <div className="space-y-3 mb-6">
                                        {order.items.slice(0, 2).map((item) => (
                                            <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                                    <Package className="h-6 w-6 text-gray-400" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-900">{item.name}</p>
                                                    <p className="text-sm text-gray-600">تعداد: {item.quantity}</p>
                                                </div>
                                                <div className="text-left">
                                                    <p className="font-medium text-gray-900">
                                                        {formatPrice(item.price)} تومان
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                        {order.items.length > 2 && (
                                            <p className="text-sm text-gray-600 text-center py-2">
                                                و {order.items.length - 2} کالای دیگر...
                                            </p>
                                        )}
                                    </div>

                                    {/* Tracking Info */}
                                    {order.trackingCode && (
                                        <div className="p-4 bg-blue-50 rounded-lg mb-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm text-blue-800 font-medium">کد رهگیری:</p>
                                                    <p className="text-blue-900 font-mono">{order.trackingCode}</p>
                                                </div>
                                                {order.deliveryDate && (
                                                    <div className="text-left">
                                                        <p className="text-sm text-blue-800">تاریخ تحویل:</p>
                                                        <p className="text-blue-900">{order.deliveryDate}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex gap-3">
                                        <Button variant="outline" size="sm" className="gap-2">
                                            <Eye className="h-4 w-4" />
                                            جزئیات سفارش
                                        </Button>
                                        {order.trackingCode && (
                                            <Button variant="outline" size="sm" className="gap-2">
                                                <Truck className="h-4 w-4" />
                                                پیگیری مرسوله
                                            </Button>
                                        )}
                                        {order.status === 'delivered' && (
                                            <Button variant="outline" size="sm" className="gap-2">
                                                <RotateCcw className="h-4 w-4" />
                                                درخواست مرجوع
                                            </Button>
                                        )}
                                        {order.status === 'delivered' && (
                                            <Button size="sm">ثبت نظر</Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Empty State */}
                {filteredOrders.length === 0 && (
                    <Card className="border-0 shadow-sm">
                        <CardContent className="text-center py-12">
                            <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {searchTerm || statusFilter !== 'all' 
                                    ? 'هیچ سفارشی یافت نشد' 
                                    : 'هیچ سفارشی ثبت نشده است'
                                }
                            </h3>
                            <p className="text-gray-600 mb-6">
                                {searchTerm || statusFilter !== 'all'
                                    ? 'لطفاً فیلترها را تغییر دهید'
                                    : 'برای شروع خرید، به فروشگاه بروید'
                                }
                            </p>
                            {!searchTerm && statusFilter === 'all' && (
                                <Button>شروع خرید</Button>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="border-0 shadow-sm text-center">
                        <CardContent className="p-4">
                            <div className="text-2xl font-bold text-green-600 mb-1">
                                {orders.filter(o => o.status === 'delivered').length}
                            </div>
                            <div className="text-sm text-gray-600">تحویل شده</div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-sm text-center">
                        <CardContent className="p-4">
                            <div className="text-2xl font-bold text-blue-600 mb-1">
                                {orders.filter(o => ['pending', 'processing'].includes(o.status)).length}
                            </div>
                            <div className="text-sm text-gray-600">در حال پردازش</div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-sm text-center">
                        <CardContent className="p-4">
                            <div className="text-2xl font-bold text-purple-600 mb-1">
                                {orders.filter(o => o.status === 'shipped').length}
                            </div>
                            <div className="text-sm text-gray-600">ارسال شده</div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-sm text-center">
                        <CardContent className="p-4">
                            <div className="text-2xl font-bold text-red-600 mb-1">
                                {orders.filter(o => o.status === 'cancelled').length}
                            </div>
                            <div className="text-sm text-gray-600">لغو شده</div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </PanelLayout>
    );
}