
import { NavMain } from '@/components/nav-main';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BellRing, BadgeDollarSign, Wallet, Heart, MapPinned, LayoutGrid, Settings, ShoppingBag, MessageCircle, LogOut, Ticket, Tags, Flag } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'داشبورد',
        href: '/admin',
        icon: LayoutGrid,
    },
    {
        title: 'کامنت‌ها',
        href: '/admin/comments',
        icon: MessageCircle,
    },
    {
        title: 'تیکت‌ها',
        href: '/admin/tickets',
        icon: Ticket,
        items: [
            {
                title: 'همه تیکت‌ها',
                href: '/admin/tickets',
                icon: Ticket,
            },
            {
                title: 'دسته‌بندی‌ها',
                href: '/admin/ticket-categories',
                icon: Tags,
            },
            {
                title: 'اولویت‌ها',
                href: '/admin/ticket-priorities',
                icon: Flag,
            },
        ],
    },
    {
        title: 'خروج',
        href: '/logout',
        icon: LogOut,
    },
];



export function AppSidebar() {
    const { unreadComments } = usePage().props as any;

    const navItemsWithBadges: NavItem[] = mainNavItems.map(item => {
        if (item.href === '/admin/comments' && unreadComments > 0) {
            return {
                ...item,
                badge: unreadComments,
            };
        }
        if (item.href === '/admin/tickets' && item.items) {
            const { unreadTickets } = usePage().props as any;
            return {
                ...item,
                badge: unreadTickets > 0 ? unreadTickets : undefined,
                items: item.items.map(subItem => {
                    if (subItem.href === '/admin/tickets' && unreadTickets > 0) {
                        return {
                            ...subItem,
                            badge: unreadTickets,
                        };
                    }
                    return subItem;
                }),
            };
        }
        return item;
    });

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/admin" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navItemsWithBadges} />
            </SidebarContent>

        </Sidebar>
    );
}
