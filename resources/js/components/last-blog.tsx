import React from "react";
import { Link } from "@inertiajs/react";

interface BlogPostProps {
  id: string;
  title: string;
  image: string;
  category: string;
  minutes: number;
  content: string;
  slug: string;
}

const BlogPostCard: React.FC<BlogPostProps> = ({
  title,
  image,
  category,
  minutes,
  content,
  slug,
}) => {
  return (
    <Link href={`/blog/${slug}`} className="block h-full">
      <div className="relative h-full rounded-2xl overflow-hidden group bg-white hover:shadow-md border transition-all duration-300">
        <div className="relative h-48 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-all duration-500 ease-out"
          />

          <div className="absolute top-4 right-4 z-10">
            <div className="bg-base-1 text-white text-xs rounded-full px-3 py-1 flex items-center">
              <div className="h-2 w-2 bg-white rounded-full"></div>
              <span className="mr-1">{category}</span>
            </div>
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-right text-xl font-bold mb-2 [direction:rtl] line-clamp-1 group-hover:text-red-500 transition-colors">
            {title}
          </h3>

          <p className="text-right text-gray-600 text-sm leading-5 line-clamp-2 [direction:rtl] mb-3">
            {content}
          </p>

          <div className="flex items-center justify-end">
            <span className="text-gray-500 text-xs [direction:rtl]">
              {minutes} دقیقه
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

const LastBlog: React.FC = () => {
  const blogPosts: BlogPostProps[] = [
    {
      id: "1",
      title: "پیکسل و پیکسل ایکس ال قابل روت شدن هستند",
      image: "/images/blog/1.png",
      category: "نقد و تحلیل",
      minutes: 6,
      content:
        "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرنگار...",
      slug: "pixel-and-pixel-xl-are-rootable",
    },
    {
      id: "2",
      title: "سلراستارهای این ماه تلفن‌شاپ مشخص شد",
      image: "/images/blog/2.png",
      category: "خبرهای ویژه و تجارت",
      minutes: 7,
      content:
        "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه...",
      slug: "this-month-phone-shop-cellerstars",
    },
    {
      id: "3",
      title: "معرفی بهترین و کاربردی ترین ویجت های لازم...",
      image: "/images/blog/3.png",
      category: "نقد و تحلیل",
      minutes: 11,
      content:
        "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه...",
      slug: "best-and-most-practical-widgets",
    },
  ];

  return (
    <section className="py-10 relative">
      <div className="container mx-auto max-w-7xl  px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-2">
            <h2 className="text-xl md:text-xl font-bold text-gray-600">
              مجله خبری
            </h2>
          </div>
          <Link
            href="/blog"
            className="text-gray-600 hover:text-base-1 text-sm"
          >
            مشاهده همه
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <BlogPostCard key={post.id} {...post} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LastBlog;