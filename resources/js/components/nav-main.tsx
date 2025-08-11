import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>منوها</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
                    const hasSubItems = item.items && item.items.length > 0;
                    const isActive = page.url.startsWith(item.href);
                    
                    if (hasSubItems) {
                        return (
                            <Collapsible key={item.title} asChild defaultOpen={isActive}>
                                <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton className='py-6' tooltip={{ children: item.title }}>
                                            {item.icon && <item.icon />}
                                            <span>{item.title}</span>
                                            {item.badge && item.badge > 0 && (
                                                <Badge variant="destructive" className="ml-auto text-xs px-1.5 py-0.5">
                                                    {item.badge > 99 ? '99+' : item.badge}
                                                </Badge>
                                            )}
                                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {item.items?.map((subItem) => (
                                                <SidebarMenuSubItem key={subItem.title}>
                                                    <SidebarMenuSubButton asChild isActive={page.url === subItem.href}>
                                                        <Link href={subItem.href} prefetch>
                                                            {subItem.icon && <subItem.icon />}
                                                            <span>{subItem.title}</span>
                                                            {subItem.badge && subItem.badge > 0 && (
                                                                <Badge variant="destructive" className="ml-auto text-xs px-1.5 py-0.5">
                                                                    {subItem.badge > 99 ? '99+' : subItem.badge}
                                                                </Badge>
                                                            )}
                                                        </Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </SidebarMenuItem>
                            </Collapsible>
                        );
                    }

                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton className='py-6' asChild isActive={isActive} tooltip={{ children: item.title }}>
                                {item.title === 'خروج' ? (
                                    <Link href={item.href} method="post" as="button">
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </Link>
                                ) : (
                                    <Link href={item.href} prefetch>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                        {item.badge && item.badge > 0 && (
                                            <Badge variant="destructive" className="ml-auto text-xs px-1.5 py-0.5">
                                                {item.badge > 99 ? '99+' : item.badge}
                                            </Badge>
                                        )}
                                    </Link>
                                )}
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
