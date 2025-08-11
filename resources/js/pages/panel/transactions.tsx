import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import PanelLayout from '@/Layouts/PanelLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
    CreditCard,
    ArrowUpRight,
    ArrowDownLeft,
    Calendar,
    Search,
    Download,
    Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Transaction {
    id: string;
    type: 'payment' | 'refund' | 'wallet_charge';
    amount: number;
    status: 'success' | 'pending' | 'failed';
    date: string;
    description: string;
    orderId?: string;
    paymentMethod: string;
}

export default function Transactions() {
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    const [transactions] = useState<Transaction[]>([
        {
            id: 'TXN001',
            type: 'payment',
            amount: 150000,
            status: 'success',
            date: '1403/05/15',
            description: 'پرداخت سفارش #12345',
            orderId: '#12345',
            paymentMethod: 'کارت بانکی'
        },
        {
            id: 'TXN002',
            type: 'refund',
            amount: 89000,
            status: 'success',
            date: '1403/05/12',
            description: 'بازگشت وجه سفارش #12344',
            orderId: '#12344',
            paymentMethod: 'کارت بانکی'
        },
        {
            id: 'TXN003',
            type: 'wallet_charge',
            amount: 500000,
            status: 'success',
            date: '1403/05/10',
            description: 'شارژ کیف پول',
            paymentMethod: 'کارت بانکی'
        },
        {
            id: 'TXN004',
            type: 'payment',
            amount: 75000,
            status: 'pending',
            date: '1403/05/08',
            description: 'پرداخت سفارش #12342',
            orderId: '#12342',
            paymentMethod: 'کیف پول'
        },
        {
            id: 'TXN005',
            type: 'payment',
            amount: 200000,
            status: 'failed',
            date: '1403/05/05',
            description: 'پرداخت سفارش #12341',
            orderId: '#12341',
            paymentMethod: 'کارت بانکی'
        }
    ]);

    const getTransactionTypeInfo = (type: Transaction['type']) => {
        const typeConfig = {
            payment: {
                label: 'پرداخت',
                color: 'text-red-600',
                bgColor: 'bg-red-50',
                icon: ArrowUpRight
            },
            refund: {
                label: 'بازگشت وجه',
                color: 'text-green-600',
                bgColor: 'bg-green-50',
                icon: ArrowDownLeft
            },
            wallet_charge: {
                label: 'شارژ کیف پول',
                color: 'text-blue-600',
                bgColor: 'bg-blue-50',
                icon: ArrowDownLeft
            }
        };
        return typeConfig[type];
    };

    const getStatusInfo = (status: Transaction['status']) => {
        const statusConfig = {
            success: {
                label: 'موفق',
                color: 'bg-green-100 text-green-800'
            },
            pending: {
                label: 'در انتظار',
                color: 'bg-yellow-100 text-yellow-800'
            },
            failed: {
                label: 'ناموفق',
                color: 'bg-red-100 text-red-800'
            }
        };
        return statusConfig[status];
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('fa-IR').format(price);
    };

    const filteredTransactions = transactions.filter(transaction => {
        const matchesSearch = transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            transaction.description.includes(searchTerm) ||
                            (transaction.orderId && transaction.orderId.includes(searchTerm));
        const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
        const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
        return matchesSearch && matchesType && matchesStatus;
    });

    const totalBalance = transactions
        .filter(t => t.status === 'success')
        .reduce((sum, t) => {
            if (t.type === 'payment') return sum - t.amount;
            return sum + t.amount;
        }, 0);

    return (
        <PanelLayout>
            <Head title="تراکنش‌ها - پنل کاربری" />
            
            <div className="space-y-8">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">تراکنش‌های مالی</h1>
                        <p className="text-gray-600">مشاهده تاریخچه تراکنش‌های حساب شما</p>
                    </div>
                    <Button variant="outline" className="gap-2">
                        <Download className="h-4 w-4" />
                        دانلود گزارش
                    </Button>
                </div>

                {/* Balance Card */}
                <Card className="border-0 shadow-sm bg-gradient-to-r from-green-500 to-green-600 text-white">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100 text-sm mb-1">موجودی کل</p>
                                <p className="text-2xl font-bold">
                                    {formatPrice(Math.abs(totalBalance))} تومان
                                </p>
                                <p className="text-green-100 text-sm mt-1">
                                    {totalBalance >= 0 ? 'اعتبار' : 'بدهی'}
                                </p>
                            </div>
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                                <CreditCard className="h-8 w-8" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Filters */}
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="relative">
                                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    placeholder="جستجو در تراکنش‌ها..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pr-10 text-right"
                                />
                            </div>
                            <select
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md text-right focus:outline-none focus:ring-1 focus:ring-green-500"
                            >
                                <option value="all">همه انواع</option>
                                <option value="payment">پرداخت</option>
                                <option value="refund">بازگشت وجه</option>
                                <option value="wallet_charge">شارژ کیف پول</option>
                            </select>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md text-right focus:outline-none focus:ring-1 focus:ring-green-500"
                            >
                                <option value="all">همه وضعیت‌ها</option>
                                <option value="success">موفق</option>
                                <option value="pending">در انتظار</option>
                                <option value="failed">ناموفق</option>
                            </select>
                            <Button variant="outline" className="gap-2">
                                <Calendar className="h-4 w-4" />
                                فیلتر تاریخ
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Transactions List */}
                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle>لیست تراکنش‌ها</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {filteredTransactions.map((transaction) => {
                                const typeInfo = getTransactionTypeInfo(transaction.type);
                                const statusInfo = getStatusInfo(transaction.status);
                                const TypeIcon = typeInfo.icon;

                                return (
                                    <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 ${typeInfo.bgColor} rounded-full flex items-center justify-center`}>
                                                <TypeIcon className={`h-5 w-5 ${typeInfo.color}`} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <p className="font-medium text-gray-900">{transaction.description}</p>
                                                    <Badge className={statusInfo.color}>
                                                        {statusInfo.label}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                                    <span>شناسه: {transaction.id}</span>
                                                    <span>تاریخ: {transaction.date}</span>
                                                    <span>روش: {transaction.paymentMethod}</span>
                                                    {transaction.orderId && (
                                                        <span>سفارش: {transaction.orderId}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-left">
                                            <p className={`text-lg font-bold ${
                                                transaction.type === 'payment' ? 'text-red-600' : 'text-green-600'
                                            }`}>
                                                {transaction.type === 'payment' ? '-' : '+'}
                                                {formatPrice(transaction.amount)} تومان
                                            </p>
                                            <p className="text-sm text-gray-500">{typeInfo.label}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Empty State */}
                {filteredTransactions.length === 0 && (
                    <Card className="border-0 shadow-sm">
                        <CardContent className="text-center py-12">
                            <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                هیچ تراکنشی یافت نشد
                            </h3>
                            <p className="text-gray-600">
                                لطفاً فیلترها را تغییر دهید یا مجدداً جستجو کنید
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border-0 shadow-sm">
                        <CardContent className="p-6 text-center">
                            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                <ArrowDownLeft className="h-6 w-6 text-green-600" />
                            </div>
                            <p className="text-2xl font-bold text-green-600 mb-1">
                                {formatPrice(
                                    transactions
                                        .filter(t => t.status === 'success' && t.type !== 'payment')
                                        .reduce((sum, t) => sum + t.amount, 0)
                                )}
                            </p>
                            <p className="text-sm text-gray-600">کل دریافتی‌ها</p>
                        </CardContent>
                    </Card>
                    
                    <Card className="border-0 shadow-sm">
                        <CardContent className="p-6 text-center">
                            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                <ArrowUpRight className="h-6 w-6 text-red-600" />
                            </div>
                            <p className="text-2xl font-bold text-red-600 mb-1">
                                {formatPrice(
                                    transactions
                                        .filter(t => t.status === 'success' && t.type === 'payment')
                                        .reduce((sum, t) => sum + t.amount, 0)
                                )}
                            </p>
                            <p className="text-sm text-gray-600">کل پرداختی‌ها</p>
                        </CardContent>
                    </Card>
                    
                    <Card className="border-0 shadow-sm">
                        <CardContent className="p-6 text-center">
                            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                <CreditCard className="h-6 w-6 text-blue-600" />
                            </div>
                            <p className="text-2xl font-bold text-blue-600 mb-1">
                                {transactions.filter(t => t.status === 'success').length}
                            </p>
                            <p className="text-sm text-gray-600">تراکنش‌های موفق</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </PanelLayout>
    );
}