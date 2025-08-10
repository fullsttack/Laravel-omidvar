import React from "react";

interface ServiceItemProps {
  icon: string;
  title: string;
  description: string;
}

const ServiceItem: React.FC<ServiceItemProps> = ({
  icon,
  title,
  description,
}) => {
  return (
    <div className="flex gap-2 items-center text-center">
      <div className="mb-3">
        <img src={icon} alt={title} width="60" height="60" />
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-xs font-medium text-gray-800 mb-1">{title}</h3>
        <p className="text-[11px] text-gray-400">{description}</p>
      </div>
    </div>
  );
};

const AboutFooter: React.FC = () => {
  const services = [
    {
      icon: "/images/footer/1.png",
      title: "هفت روز ضمانت بازگشت",
      description: "پس از خرید فرصت دارید",
    },
    {
      icon: "/images/footer/2.png",
      title: "ارسال سریع‌ترین باکس",
      description: "اتوماتیک ارسال مرسوله",
    },
    {
      icon: "/images/footer/3.png",
      title: "اطلاع‌رسانی و پویا",
      description: "تخفیف‌های ویژه ماهانه",
    },
    {
      icon: "/images/footer/4.png",
      title: "پنل کاربری قوی",
      description: "مدیریت سفارشات",
    },
    {
      icon: "/images/footer/5.png",
      title: "شیپینگ هوشمند",
      description: "خرید سریع و آسان",
    },
    {
      icon: "/images/footer/6.png",
      title: "نوتیفیکیشن هوشمند",
      description: "خبررسانی به کاربران",
    },
  ];

  return (
    <section className="hidden md:block py-8">
      <div className="container mx-auto max-w-7xl  px-4">
        <div className="flex items-center md:gap-32 justify-between mb-8">
          <div className="hidden md:block">
            <img
              src="/images/logo/1.gif"
              alt="Bitino Logo"
              width="150"
              height="60"
              className="ml-auto"
            />
          </div>
          <div className="flex">
            <p className="text-sm text-gray-400 leading-relaxed text-justify">
               وبسایت فروشگاهی امیدوار فود پیدا کردن و معرفی محصولات نوآورانه. حتما می
              پرسی محصول یا توجه! محصول نو یعنی محصولی که یک مشکل و نیاز شما رو
              به شکل بهینه تر از گذشته حل کنه! شاید شما هم مشکل حل کنما شما
              همیشون با مشکل کمتر شارژش کنیو! و خب برای همین باپورت با شارژ
              قندکی که احتمالا همتون باهاش آشنایی دارین ساخت شارژکن زندگی چون
              تیکرار میخواد کار سختیه.
            </p>
          </div>

          <div className="w-3/12 hidden md:block">
            <img
              src="/images/logo/5.gif"
              alt="omidvarfood Logo"
              width="150"
              height="150"
              className="ml-auto"
            />
          </div>
        </div>

        <div className="border-b  border-gray-100 mb-5"></div>

        <div className="w-full grid grid-cols-2 md:grid-cols-6 gap-4">
          {services.map((service, index) => (
            <ServiceItem
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
            />
          ))}
        </div>

        <div className="border-t  border-gray-100 mt-5"></div>
      </div>
    </section>
  );
};

export default AboutFooter;