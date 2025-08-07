
export default function HeroBanners() {
    return (
        <div className="mt-8">
            <div className="container mx-auto px-4 py-6">
                <div className="w-full flex flex-col sm:flex-row gap-4 h-8/12">
                    {/* بنر اصلی */}
                    <div className="w-full sm:w-9/12">
                        <img 
                            src="/images/banner/1.webp" 
                            alt=""
                            className="w-full h-full rounded-sm sm:rounded-2xl"
                        />
                    </div>

                    {/* بنرهای کناری */}
                    <div className="w-full sm:w-3/12 flex sm:flex-col gap-6 sm:-mt-4">
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