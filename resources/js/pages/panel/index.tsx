import React from 'react';
import { Head } from '@inertiajs/react';
import PanelLayout from '@/layouts/PanelLayout';

export default function PanelIndex() {
   
    return (
        <PanelLayout>
            <Head title="داشبورد - پنل کاربری" />
            
            <div className="space-y-8">
                {/* Page Header */}
                <div className="bg-white rounded-xl p-6 shadow-sm border">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">داشبورد</h1>
                    <p className="text-gray-600">خوش آمدید! خلاصه‌ای از فعالیت‌های اخیر شما</p>
                </div>

               
            </div>
        </PanelLayout>
    );
}