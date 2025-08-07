
export default function HeroBanners() {
    return (
        <div className="mt-8">
            <div className="container mx-auto px-4 py-6">
                <div className="w-full flex gap-4 h-8/12">
                    {/* بنر اصلی */}
                    <div className="w-9/12">
                        <img 
                            src="/images/banner/1.webp" 
                            alt=""
                            className="w-full h-full rounded-2xl"
                        />
                    </div>

                    {/* بنرهای کناری */}
                    <div className="w-3/12 flex flex-col gap-6 -mt-4">
                        <div className="">
                            <img 
                                src="/images/banner/2.webp" 
                                alt=""
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="">
                            <img 
                                src="/images/banner/4.webp" 
                                alt=""
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}