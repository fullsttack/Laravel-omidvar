import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import {
    X,
    Play,
    Pause,
    Heart,
    Star,
    Gift,
    Sparkles,
    Eye
} from 'lucide-react';
import Autoplay from 'embla-carousel-autoplay';

interface Story {
    id: string;
    title: string;
    subtitle?: string;
    image: string;
    duration: number;
    category: 'offer' | 'product' | 'brand' | 'news';
    isNew?: boolean;
    views: number;
    likes: number;
}

interface StoryUser {
    id: string;
    name: string;
    avatar: string;
    stories: Story[];
    isViewed?: boolean;
}

const storiesData: StoryUser[] = [
    {
        id: '1',
        name: 'پیشنهادات ویژه',
        avatar: '/images/product/1.webp',
        stories: [
            {
                id: '1-1',
                title: 'تخفیف ۳۰٪ برنج هاشمی',
                subtitle: 'فقط تا پایان هفته',
                image: '/images/product/2.webp',
                duration: 5000,
                category: 'offer',
                isNew: true,
                views: 1245,
                likes: 89
            }
        ]
    },
    {
        id: '2',
        name: 'محصولات جدید',
        avatar: '/images/product/3.webp',
        stories: [
            {
                id: '2-1',
                title: 'زعفران نگین درجه یک',
                subtitle: 'تازه رسید',
                image: '/images/product/4.webp',
                duration: 6000,
                category: 'product',
                isNew: true,
                views: 654,
                likes: 45
            }
        ]
    },
    {
        id: '3',
        name: 'برند امیدوار',
        avatar: '/images/product/5.webp',
        stories: [
            {
                id: '3-1',
                title: 'داستان برند امیدوار',
                subtitle: '۲۰ سال تجربه',
                image: '/images/product/6.webp',
                duration: 8000,
                category: 'brand',
                views: 2134,
                likes: 156
            }
        ]
    },
    {
        id: '4',
        name: 'خشکبار پرمیوم',
        avatar: '/images/product/7.webp',
        stories: [
            {
                id: '4-1',
                title: 'بادام کالیفرنیا',
                subtitle: 'کیفیت صادراتی',
                image: '/images/product/8.webp',
                duration: 5000,
                category: 'product',
                views: 743,
                likes: 52
            }
        ]
    },
    {
        id: '5',
        name: 'حبوبات ارگانیک',
        avatar: '/images/product/9.webp',
        stories: [
            {
                id: '5-1',
                title: 'عدس قرمز ارگانیک',
                subtitle: 'بدون مواد شیمیایی',
                image: '/images/product/10.webp',
                duration: 4500,
                category: 'product',
                views: 432,
                likes: 31
            }
        ]
    },
    {
        id: '6',
        name: 'چای و قهوه',
        avatar: '/images/product/11.webp',
        stories: [
            {
                id: '6-1',
                title: 'چای احمد درجه یک',
                subtitle: 'طعم اصیل',
                image: '/images/product/12.webp',
                duration: 5500,
                category: 'product',
                views: 821,
                likes: 67
            }
        ]
    },
    {
        id: '7',
        name: 'ادویه جات',
        avatar: '/images/product/13.webp',
        stories: [
            {
                id: '7-1',
                title: 'زردچوبه خالص',
                subtitle: 'کیفیت درجه یک',
                image: '/images/product/14.webp',
                duration: 4000,
                category: 'product',
                views: 512,
                likes: 38
            }
        ]
    },
    {
        id: '8',
        name: 'کنسرو و آماده',
        avatar: '/images/product/15.webp',
        stories: [
            {
                id: '8-1',
                title: 'تن ماهی درجه یک',
                subtitle: 'تازه و با کیفیت',
                image: '/images/product/16.webp',
                duration: 6000,
                category: 'product',
                views: 691,
                likes: 54
            }
        ]
    },
    {
        id: '9',
        name: 'روغن و سرکه',
        avatar: '/images/product/16.webp',
        stories: [
            {
                id: '9-1',
                title: 'روغن زیتون خالص',
                subtitle: 'طبیعی و ارگانیک',
                image: '/images/product/17.webp',
                duration: 5000,
                category: 'product',
                views: 456,
                likes: 34
            }
        ]
    },
    {
        id: '10',
        name: 'شکلات و شیرینی',
        avatar: '/images/product/17.webp',
        stories: [
            {
                id: '10-1',
                title: 'شکلات تلخ ۷۰٪',
                subtitle: 'وارداتی درجه یک',
                image: '/images/product/1.webp',
                duration: 4500,
                category: 'product',
                views: 623,
                likes: 47
            }
        ]
    },
    {
        id: '11',
        name: 'نان و کیک',
        avatar: '/images/product/2.webp',
        stories: [
            {
                id: '11-1',
                title: 'نان تست کامل',
                subtitle: 'غنی از فیبر',
                image: '/images/product/3.webp',
                duration: 5500,
                category: 'product',
                views: 378,
                likes: 28
            }
        ]
    },
    {
        id: '12',
        name: 'لبنیات',
        avatar: '/images/product/4.webp',
        stories: [
            {
                id: '12-1',
                title: 'ماست یونانی',
                subtitle: 'پروتئین بالا',
                image: '/images/product/5.webp',
                duration: 4000,
                category: 'product',
                views: 567,
                likes: 42
            }
        ]
    },
    {
        id: '13',
        name: 'میوه تازه',
        avatar: '/images/product/6.webp',
        stories: [
            {
                id: '13-1',
                title: 'سیب قرمز',
                subtitle: 'تازه از باغ',
                image: '/images/product/7.webp',
                duration: 6000,
                category: 'product',
                views: 789,
                likes: 58
            }
        ]
    },
    {
        id: '14',
        name: 'سبزیجات',
        avatar: '/images/product/8.webp',
        stories: [
            {
                id: '14-1',
                title: 'کاهو ارگانیک',
                subtitle: 'بدون سم',
                image: '/images/product/9.webp',
                duration: 3500,
                category: 'product',
                views: 234,
                likes: 19
            }
        ]
    },
    {
        id: '15',
        name: 'نوشیدنی',
        avatar: '/images/product/10.webp',
        stories: [
            {
                id: '15-1',
                title: 'آب معدنی',
                subtitle: 'طبیعی و خالص',
                image: '/images/product/11.webp',
                duration: 4500,
                category: 'product',
                views: 445,
                likes: 33
            }
        ]
    },
    {
        id: '16',
        name: 'سالاد و ترشی',
        avatar: '/images/product/12.webp',
        stories: [
            {
                id: '16-1',
                title: 'ترشی مخلوط',
                subtitle: 'طعم اصیل ایرانی',
                image: '/images/product/13.webp',
                duration: 5000,
                category: 'product',
                views: 356,
                likes: 27
            }
        ]
    },
    {
        id: '17',
        name: 'مکمل غذایی',
        avatar: '/images/product/14.webp',
        stories: [
            {
                id: '17-1',
                title: 'پروتئین وی',
                subtitle: 'برای ورزشکاران',
                image: '/images/product/15.webp',
                duration: 6500,
                category: 'product',
                views: 612,
                likes: 51
            }
        ]
    }
];

export default function Stories() {
    const [selectedUser, setSelectedUser] = useState<StoryUser | null>(null);
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [viewedStories, setViewedStories] = useState<Set<string>>(new Set());

    const plugin = React.useRef(
        Autoplay({ delay: 5000, stopOnInteraction: false })
    );

    const currentStory = selectedUser?.stories[currentStoryIndex];

    useEffect(() => {
        if (selectedUser && isPlaying && currentStory) {
            const duration = currentStory.duration;
            const interval = 50;
            const increment = (interval / duration) * 100;

            const progressInterval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        handleNext();
                        return 0;
                    }
                    return prev + increment;
                });
            }, interval);

            return () => clearInterval(progressInterval);
        }
    }, [selectedUser, currentStoryIndex, isPlaying, currentStory]);

    const openStory = (user: StoryUser, storyIndex = 0) => {
        setSelectedUser(user);
        setCurrentStoryIndex(storyIndex);
        setProgress(0);
        setIsPlaying(true);
        setViewedStories(prev => new Set([...prev, user.id]));
    };

    const closeStory = () => {
        setSelectedUser(null);
        setCurrentStoryIndex(0);
        setProgress(0);
    };

    const handleNext = () => {
        if (!selectedUser) return;
        
        if (currentStoryIndex < selectedUser.stories.length - 1) {
            setCurrentStoryIndex(prev => prev + 1);
            setProgress(0);
        } else {
            const currentUserIndex = storiesData.findIndex(u => u.id === selectedUser.id);
            if (currentUserIndex < storiesData.length - 1) {
                openStory(storiesData[currentUserIndex + 1]);
            } else {
                closeStory();
            }
        }
    };

    const handlePrevious = () => {
        if (!selectedUser) return;
        
        if (currentStoryIndex > 0) {
            setCurrentStoryIndex(prev => prev - 1);
            setProgress(0);
        } else {
            const currentUserIndex = storiesData.findIndex(u => u.id === selectedUser.id);
            if (currentUserIndex > 0) {
                const prevUser = storiesData[currentUserIndex - 1];
                openStory(prevUser, prevUser.stories.length - 1);
            }
        }
    };

    const togglePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const getCategoryIcon = (category: Story['category']) => {
        switch (category) {
            case 'offer': return <Gift className="h-4 w-4" />;
            case 'product': return <Star className="h-4 w-4" />;
            case 'brand': return <Sparkles className="h-4 w-4" />;
            case 'news': return <Eye className="h-4 w-4" />;
            default: return null;
        }
    };

    const getCategoryColor = (category: Story['category']) => {
        switch (category) {
            case 'offer': return 'bg-red-500';
            case 'product': return 'bg-blue-500';
            case 'brand': return 'bg-purple-500';
            case 'news': return 'bg-green-500';
            default: return 'bg-gray-500';
        }
    };

    const getCategoryName = (category: Story['category']) => {
        switch (category) {
            case 'offer': return 'پیشنهاد ویژه';
            case 'product': return 'محصول';
            case 'brand': return 'برند';
            case 'news': return 'اخبار';
            default: return '';
        }
    };

    return (
        <>
            <div className="py-6 mt-8">
                <div className="container mx-auto px-4">
                    <Carousel
                        
                        className="w-full"
                        plugins={[plugin.current]}
                        opts={{
                            align: "start",
                            loop: true,
                            direction: "rtl",
                            slidesToScroll: 4,
                            containScroll: false,
                        }}
                    >
                        <CarouselContent className="-ml-1 md:-ml-2">
                            {storiesData.map((user) => {
                                const isViewed = viewedStories.has(user.id);
                                return (
                                    <CarouselItem key={user.id} className="pl-1 md:pl-2 basis-1/4 md:basis-1/6 lg:basis-[11%]">
                                        <div
                                            className={`cursor-pointer transition-all duration-300 hover:scale-105 text-center ${
                                                isViewed ? 'opacity-60' : ''
                                            }`}
                                            onClick={() => openStory(user)}
                                        >
                                            <div className="mb-2 flex justify-center">
                                                <div className={`relative p-0.5 rounded-full ${
                                                    isViewed 
                                                        ? 'bg-gray-300' 
                                                        : 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600'
                                                }`}>
                                                    <Avatar className="w-24 h-24 border-2 border-white">
                                                        <AvatarImage src={user.avatar} alt={user.name} />
                                                        <AvatarFallback>
                                                            {user.name.slice(0, 2)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                </div>
                                            </div>
                                            
                                            <h3 className="text-xs font-medium text-gray-800 leading-tight">
                                                {user.name}
                                            </h3>
                                        </div>
                                    </CarouselItem>
                                );
                            })}
                        </CarouselContent>
                    </Carousel>
                </div>
            </div>

            <Dialog open={!!selectedUser} onOpenChange={() => closeStory()}>
                <DialogContent className="max-w-md w-full h-[80vh] p-0 bg-black rounded-2xl overflow-hidden">
                    {selectedUser && currentStory && (
                        <div className="relative w-full h-full">
                            <div className="absolute top-4 left-4 right-4 z-20 flex gap-1">
                                {selectedUser.stories.map((_, index) => (
                                    <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-white rounded-full transition-all duration-100"
                                            style={{
                                                width: `${
                                                    index < currentStoryIndex 
                                                        ? 100 
                                                        : index === currentStoryIndex 
                                                            ? progress 
                                                            : 0
                                                }%`
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="absolute top-8 left-4 right-4 z-20 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Avatar className="w-8 h-8">
                                        <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                                        <AvatarFallback>{selectedUser.name.slice(0, 2)}</AvatarFallback>
                                    </Avatar>
                                    <div className="text-white">
                                        <p className="text-sm font-medium">{selectedUser.name}</p>
                                        <p className="text-xs opacity-80">۲ ساعت پیش</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-white hover:bg-white/20 w-8 h-8"
                                        onClick={togglePlayPause}
                                    >
                                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                                    </Button>
                                    
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-white hover:bg-white/20 w-8 h-8"
                                        onClick={closeStory}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <div
                                className="w-full h-full bg-cover bg-center bg-no-repeat relative"
                                style={{ backgroundImage: `url(${currentStory.image})` }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
                                
                                <div className="absolute inset-0 flex">
                                    <div
                                        className="flex-1 cursor-pointer"
                                        onClick={handlePrevious}
                                    />
                                    <div
                                        className="flex-1 cursor-pointer"
                                        onClick={handleNext}
                                    />
                                </div>
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className={`w-6 h-6 rounded-full ${getCategoryColor(currentStory.category)} flex items-center justify-center`}>
                                        {getCategoryIcon(currentStory.category)}
                                    </div>
                                    <Badge variant="secondary" className="text-xs">
                                        {getCategoryName(currentStory.category)}
                                    </Badge>
                                    {currentStory.isNew && (
                                        <Badge className="bg-red-500 text-xs">جدید</Badge>
                                    )}
                                </div>
                                
                                <h2 className="text-xl font-bold mb-1">{currentStory.title}</h2>
                                {currentStory.subtitle && (
                                    <p className="text-white/80 mb-4">{currentStory.subtitle}</p>
                                )}
                                
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 text-sm text-white/80">
                                        <div className="flex items-center gap-1">
                                            <Eye className="h-4 w-4" />
                                            <span>{currentStory.views.toLocaleString()}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Heart className="h-4 w-4" />
                                            <span>{currentStory.likes}</span>
                                        </div>
                                    </div>
                                    
                                    <Button size="sm" variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                                        <Heart className="h-4 w-4 ml-1" />
                                        پسندیدم
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}