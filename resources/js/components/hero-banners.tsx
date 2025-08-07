
export default function HeroBanners() {
    return (
        <div className="bg-white">
            <div className="container mx-auto px-4 py-6">
                {/* Top Section: 1 Large + 2 Small */}
                <div className='w-full flex '>
                    <div className='flex items-center gap-4'>
                        <div className="">
                            <img src="/images/banner/1.webp" alt="" />
                        </div>

                        <div className='flex flex-col gap-6'>
                            <img src="/images/banner/2.webp" alt="" />
                            <img src="/images/banner/4.webp" alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}