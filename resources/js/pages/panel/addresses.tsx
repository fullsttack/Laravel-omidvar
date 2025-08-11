import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import PanelLayout from '@/Layouts/PanelLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    MapPin, 
    Plus, 
    Edit2, 
    Trash2, 
    Home,
    Building,
    MoreHorizontal,
    Star
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Address {
    id: number;
    title: string;
    address: string;
    city: string;
    province: string;
    postalCode: string;
    receiverName: string;
    receiverMobile: string;
    isDefault: boolean;
    type: 'home' | 'work' | 'other';
}

export default function Addresses() {
    const [addresses] = useState<Address[]>([
        {
            id: 1,
            title: 'منزل',
            address: 'تهران، خیابان ولیعصر، کوچه پانزده، پلاک 12',
            city: 'تهران',
            province: 'تهران',
            postalCode: '1234567890',
            receiverName: 'محمد احمدی',
            receiverMobile: '09123456789',
            isDefault: true,
            type: 'home'
        },
        {
            id: 2,
            title: 'محل کار',
            address: 'تهران، خیابان کریمخان، برج میلاد، طبقه 15',
            city: 'تهران',
            province: 'تهران',
            postalCode: '0987654321',
            receiverName: 'محمد احمدی',
            receiverMobile: '09123456789',
            isDefault: false,
            type: 'work'
        },
        {
            id: 3,
            title: 'خانه مادر',
            address: 'کرج، خیابان فردوس، کوچه گل‌ها، پلاک 8',
            city: 'کرج',
            province: 'البرز',
            postalCode: '5432167890',
            receiverName: 'فاطمه احمدی',
            receiverMobile: '09987654321',
            isDefault: false,
            type: 'other'
        }
    ]);

    const getAddressIcon = (type: string) => {
        switch (type) {
            case 'home':
                return <Home className="h-4 w-4" />;
            case 'work':
                return <Building className="h-4 w-4" />;
            default:
                return <MapPin className="h-4 w-4" />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'home':
                return 'bg-blue-50 text-blue-700';
            case 'work':
                return 'bg-green-50 text-green-700';
            default:
                return 'bg-gray-50 text-gray-700';
        }
    };

    return (
        <PanelLayout>
            <Head title="آدرس‌ها - پنل کاربری" />
            
            <div className="space-y-8">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">آدرس‌های من</h1>
                        <p className="text-gray-600">مدیریت آدرس‌های تحویل سفارشات</p>
                    </div>
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        افزودن آدرس جدید
                    </Button>
                </div>

                {/* Addresses Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {addresses.map((address) => (
                        <Card key={address.id} className="border-0 shadow-sm relative">
                            <CardHeader className="pb-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getTypeColor(address.type)}`}>
                                            {getAddressIcon(address.type)}
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg flex items-center gap-2">
                                                {address.title}
                                                {address.isDefault && (
                                                    <Badge variant="secondary" className="gap-1 text-xs">
                                                        <Star className="h-3 w-3 fill-current" />
                                                        پیش‌فرض
                                                    </Badge>
                                                )}
                                            </CardTitle>
                                        </div>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem className="gap-2">
                                                <Edit2 className="h-4 w-4" />
                                                ویرایش
                                            </DropdownMenuItem>
                                            {!address.isDefault && (
                                                <DropdownMenuItem className="gap-2">
                                                    <Star className="h-4 w-4" />
                                                    انتخاب به عنوان پیش‌فرض
                                                </DropdownMenuItem>
                                            )}
                                            <DropdownMenuItem className="gap-2 text-red-600">
                                                <Trash2 className="h-4 w-4" />
                                                حذف
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Address Details */}
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">آدرس:</p>
                                        <p className="text-gray-900 text-sm leading-relaxed">
                                            {address.address}
                                        </p>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">شهر:</p>
                                            <p className="text-gray-900 text-sm">{address.city}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">استان:</p>
                                            <p className="text-gray-900 text-sm">{address.province}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">کد پستی:</p>
                                        <p className="text-gray-900 text-sm font-mono">{address.postalCode}</p>
                                    </div>
                                </div>

                                {/* Receiver Info */}
                                <div className="pt-4 border-t border-gray-100">
                                    <p className="text-sm text-gray-600 mb-2">اطلاعات گیرنده:</p>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-900 text-sm font-medium">{address.receiverName}</p>
                                            <p className="text-gray-600 text-sm">{address.receiverMobile}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2 pt-2">
                                    <Button variant="outline" size="sm" className="flex-1 gap-2">
                                        <Edit2 className="h-4 w-4" />
                                        ویرایش
                                    </Button>
                                    <Button 
                                        variant="default" 
                                        size="sm" 
                                        className="flex-1"
                                        disabled={address.isDefault}
                                    >
                                        {address.isDefault ? 'آدرس پیش‌فرض' : 'انتخاب برای سفارش'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Empty State (if no addresses) */}
                {addresses.length === 0 && (
                    <Card className="border-0 shadow-sm">
                        <CardContent className="text-center py-12">
                            <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                هیچ آدرسی ثبت نشده است
                            </h3>
                            <p className="text-gray-600 mb-6">
                                برای ثبت سفارش، ابتدا یک آدرس اضافه کنید
                            </p>
                            <Button className="gap-2">
                                <Plus className="h-4 w-4" />
                                افزودن اولین آدرس
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Quick Actions */}
                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle>نکات مهم</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                <p className="text-sm text-blue-800">
                                    آدرس پیش‌فرض شما برای تمام سفارشات استفاده خواهد شد
                                </p>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                <p className="text-sm text-green-800">
                                    کد پستی صحیح باعث تسریع در ارسال سفارش شما می‌شود
                                </p>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
                                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                                <p className="text-sm text-amber-800">
                                    در صورت عدم حضور، لطفاً شماره فرد جایگزین را در آدرس درج کنید
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </PanelLayout>
    );
}