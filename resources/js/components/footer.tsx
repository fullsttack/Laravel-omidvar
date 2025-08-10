import React from "react";
import { Link } from "@inertiajs/react";

const Footer: React.FC = () => {
  return (
    <footer className="md:pt-8 pb-0">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-16 2xl:px-32">
        {/* Top Section with Columns */}
        <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8 sm:gap-12 lg:gap-16 pb-6">
          {/* Column 1 - Newsletter Signup */}
          <div className="sm:col-span-2">
            <h3 className="text-base-1 text-sm sm:text-base font-bold mb-3 sm:mb-4 text-right">
              فروشگاه امیدوار فود
            </h3>
            <p className="text-xs text-gray-600 mb-4 text-right leading-relaxed">
              هدف اصلی فروشگاه امیدوار فود همیشه پیدا کردن و معرفی محصولات
              نوآورانه. حتما می پرسی محصول نو چیه؟ محصول نو یعنی محصولی که یک
              مشکل و نیاز شما رو به شکل بهینه تراز گذشته حل کنه! هدف اصلی قالب
              وردپرس شاپی همیشه پیدا کردن و معرفی محصولات نوآورانه. حتما می پرسی
              محصول نو چیه؟ محصول نو یعنی محصولی که یک مشکل و نیاز شما رو به شکل
              بهینه تراز گذشته حل کنه!
            </p>
          </div>

          {/* Column 2 - Customer Service */}
          <div className="sm:col-span-1">
            <h3 className="text-sm font-medium mb-3 sm:mb-4 text-right">
              راهنمای مشتریان
            </h3>
            <ul className="space-y-1 sm:space-y-2">
              <li>
                <Link
                  href="/blog"
                  className="text-xs text-gray-500 block text-right hover:text-gray-800"
                >
                  مجله خبری
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-xs text-gray-500 block text-right hover:text-gray-800"
                >
                  درباره ما
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-xs text-gray-500 block text-right hover:text-gray-800"
                >
                  تماس با ما
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="text-xs text-gray-500 block text-right hover:text-gray-800"
                >
                  سبد خرید
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-xs text-gray-500 block text-right hover:text-gray-800"
                >
                  حساب کاربری
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Site Access */}
          <div className="sm:col-span-1">
            <h3 className="text-sm font-medium mb-3 sm:mb-4 text-right">
              دسترسی به سایت
            </h3>
            <ul className="space-y-1 sm:space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-xs text-gray-500 block text-right hover:text-gray-800"
                >
                  صفحه اصلی
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-xs text-gray-500 block text-right hover:text-gray-800"
                >
                  همه محصولات
                </Link>
              </li>
              <li>
                <Link
                  href="/offers"
                  className="text-xs text-gray-500 block text-right hover:text-gray-800"
                >
                  شگفت انگیزها
                </Link>
              </li>
              <li>
                <Link
                  href="/reports"
                  className="text-xs text-gray-500 block text-right hover:text-gray-800"
                >
                  گزارش و پیشنهاد
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-xs text-gray-500 block text-right hover:text-gray-800"
                >
                  سوالات متداول
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 - Product Categories */}
          <div className="sm:col-span-1">
            <h3 className="text-sm font-medium mb-3 sm:mb-4 text-right">
              محبوب‌ترین دسته‌ها
            </h3>
            <ul className="space-y-1 sm:space-y-2">
              <li>
                <Link
                  href="/category/mobile"
                  className="text-xs text-gray-500 block text-right hover:text-gray-800"
                >
                  موبایل و لوازم جانبی
                </Link>
              </li>
              <li>
                <Link
                  href="/category/laptop"
                  className="text-xs text-gray-500 block text-right hover:text-gray-800"
                >
                  لپ تاپ و لوازم جانبی
                </Link>
              </li>
              <li>
                <Link
                  href="/category/home-appliances"
                  className="text-xs text-gray-500 block text-right hover:text-gray-800"
                >
                  لوازم خانگی برقی
                </Link>
              </li>
              <li>
                <Link
                  href="/category/gaming"
                  className="text-xs text-gray-500 block text-right hover:text-gray-800"
                >
                  گیمینگ و لوازم
                </Link>
              </li>
              <li>
                <Link
                  href="/category/headphones"
                  className="text-xs text-gray-500 block text-right hover:text-gray-800"
                >
                  هدفون و هدست
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section with Logos and Contact */}
        <div className="flex flex-col sm:flex-row py-4 px-2 sm:px-4 rounded-lg mt-2">
          <div className="w-full flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
            {/* right - Contact Info */}
            <div className="w-full sm:w-auto flex flex-col gap-2 text-gray-400 text-center sm:text-right mb-4 sm:mb-0">
              <p className="text-xs sm:text-sm">تمامی حقوق این سایت متعلق به فروشگاه اینترنتی امیدوار فود می باشد</p>
            </div>

            {/* left - Trust Logos */}
            <div className="w-full sm:w-auto flex justify-center items-center bg-gray-50 p-2 rounded-lg">
              <div className="flex flex-wrap justify-center sm:justify-end gap-3 sm:gap-4 lg:gap-6">
                <img
                  src="/images/footer/7.png"
                  alt="گواهی 1"
                  width="45"
                  height="45"
                  className="object-contain sm:w-[55px] sm:h-[55px]"
                />
                <img
                  src="/images/footer/8.png"
                  alt="گواهی 2"
                  width="45"
                  height="45"
                  className="object-contain sm:w-[55px] sm:h-[55px]"
                />
                <img
                  src="/images/footer/10.png"
                  alt="گواهی 4"
                  width="45"
                  height="45"
                  className="object-contain sm:w-[55px] sm:h-[55px]"
                />
                <img
                  src="/images/footer/11.png"
                  alt="گواهی 5"
                  width="45"
                  height="45"
                  className="object-contain sm:w-[55px] sm:h-[55px]"
                />
                <img
                  src="/images/footer/12.png"
                  alt="گواهی 6"
                  width="45"
                  height="45"
                  className="object-contain sm:w-[55px] sm:h-[55px]"
                />
                <img
                  src="/images/footer/13.png"
                  alt="گواهی 7"
                  width="45"
                  height="45"
                  className="object-contain sm:w-[55px] sm:h-[55px]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;