import React from 'react';


export default function BannerDiscount() {
    return (
        <div className='container mx-auto max-w-6xl flex flex-col sm:flex-row w-full justify-center items-center gap-12 py-12'>
            <div className='w-full sm:w-2/3 flex justify-center'>
                <img className='w-full max-w-xs' src="/images/banner/6.webp" alt="banner" />
            </div>

            <div className='w-full sm:w-2/3 flex justify-center'>
                <img className='w-full max-w-xs' src="/images/banner/5.webp" alt="banner" />
            </div>

            <div className='w-full sm:w-2/3 flex justify-center'>
                <img className='w-full max-w-xs' src="/images/banner/6.webp" alt="banner" />
            </div>
        </div>
    );
}