
import { NavMain } from '@/components/nav-main';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BellRing, BadgeDollarSign, Wallet, Heart, MapPinned, LayoutGrid, Settings, ShoppingBag, MessageCircle, LogOut } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'داشبورد',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'کیف پول',
        href: '/wallet',
        icon: Wallet,
    },
    {
        title: 'سفارش ها',
        href: '/orders',
        icon: ShoppingBag,
    },
    {
        title: 'تراکنش ها',
        href: '/transactions',
        icon: BadgeDollarSign,
    },
    {
        title: 'لیست شما',
        href: '/lists',
        icon: Heart,
    },
    {
        title: 'آدرس ها',
        href: '/addresses',
        icon: MapPinned,
    },
    {
        title: 'پیام ها',
        href: '/notification',
        icon: BellRing,
    },
    {
        title: 'پشتیبانی',
        href: '/support',
        icon: MessageCircle,
    },
    {
        title: 'تنظیمات',
        href: '/settings/profile',
        icon: Settings,
    },
    {
        title: 'خروج',
        href: '/logout',
        icon: LogOut,
    },
];



export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

        </Sidebar>
    );
}
