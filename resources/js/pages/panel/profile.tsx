import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import PanelLayout from '@/Layouts/PanelLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
    Phone, 
    Mail, 
    Save,
} from 'lucide-react';

export default function Profile() {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: 'محمد',
        lastName: 'احمدی',
        mobile: '09123456789',
        email: 'mohammad@example.com',
        nationalCode: '1234567890',
        birthDate: '1370/01/01',
        gender: 'male',
        city: 'تهران',
        province: 'تهران'
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = () => {
        // Here you would typically send the data to your backend
        console.log('Saving profile data:', formData);
        setIsEditing(false);
    };

    return (
        <PanelLayout>
            <Head title="پروفایل - پنل کاربری" />
            
            <div className="space-y-8">
               

                <div className="flex flex-col gap-6">
                    {/* Personal Information */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border-0 shadow-sm">
                            <CardHeader>
                                <CardTitle>اطلاعات شخصی</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">نام</Label>
                                        <Input
                                            id="firstName"
                                            value={formData.firstName}
                                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                                            disabled={!isEditing}
                                            className="text-right"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">نام خانوادگی</Label>
                                        <Input
                                            id="lastName"
                                            value={formData.lastName}
                                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                                            disabled={!isEditing}
                                            className="text-right"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="mobile">شماره موبایل</Label>
                                        <div className="relative">
                                            <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="mobile"
                                                value={formData.mobile}
                                                onChange={(e) => handleInputChange('mobile', e.target.value)}
                                                disabled={!isEditing}
                                                className="pr-10 text-right"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">ایمیل</Label>
                                        <div className="relative">
                                            <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => handleInputChange('email', e.target.value)}
                                                disabled={!isEditing}
                                                className="pr-10 text-right"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="nationalCode">کد ملی</Label>
                                        <Input
                                            id="nationalCode"
                                            value={formData.nationalCode}
                                            onChange={(e) => handleInputChange('nationalCode', e.target.value)}
                                            disabled={!isEditing}
                                            className="text-right"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="birthDate">تاریخ تولد</Label>
                                        <Input
                                            id="birthDate"
                                            value={formData.birthDate}
                                            onChange={(e) => handleInputChange('birthDate', e.target.value)}
                                            disabled={!isEditing}
                                            className="text-right"
                                            placeholder="1370/01/01"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="gender">جنسیت</Label>
                                    <select
                                        id="gender"
                                        value={formData.gender}
                                        onChange={(e) => handleInputChange('gender', e.target.value)}
                                        disabled={!isEditing}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-right focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-50 disabled:text-gray-500"
                                    >
                                        <option value="">انتخاب کنید</option>
                                        <option value="male">مرد</option>
                                        <option value="female">زن</option>
                                    </select>
                                </div>

                                {isEditing && (
                                    <div className="flex justify-end gap-3 pt-4 border-t">
                                        <Button 
                                            variant="outline" 
                                            onClick={() => setIsEditing(false)}
                                        >
                                            لغو
                                        </Button>
                                        <Button onClick={handleSave} className="gap-2">
                                            <Save className="h-4 w-4" />
                                            ذخیره تغییرات
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Account Security */}
                        <Card className="border-0 shadow-sm">
                            <CardHeader>
                                <CardTitle>امنیت حساب</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-900">شماره موبایل</p>
                                            <p className="text-sm text-gray-600">تایید شده</p>
                                        </div>
                                        <span className="text-green-600 text-sm font-medium">
                                            ✓ فعال
                                        </span>
                                    </div>
                                    
                                    <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-900">آدرس ایمیل</p>
                                            <p className="text-sm text-gray-600">نیاز به تایید</p>
                                        </div>
                                        <Button variant="outline" size="sm">
                                            تایید ایمیل
                                        </Button>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-900">رمز عبور</p>
                                            <p className="text-sm text-gray-600">آخرین تغییر: 2 ماه پیش</p>
                                        </div>
                                        <Button variant="outline" size="sm">
                                            تغییر رمز
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </PanelLayout>
    );
}