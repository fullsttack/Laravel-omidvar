import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    first_name?: string | null;
    last_name?: string | null;
    national_code?: string | null;
    mobile?: string | null;
    email?: string | null;
    avatar?: string;
    email_verified_at: string | null;
    mobile_verified_at: string | null;
    activation?: number;
    activation_date?: string | null;
    user_type?: number;
    status?: number;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Comment {
    id: number;
    body: string;
    parent_id: number | null;
    author_id: number;
    commentable_id: number;
    commentable_type: string;
    seen: number;
    approved: number;
    status: number;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
    author?: User;
    parent?: Comment;
    replies?: Comment[];
    commentable?: any;
}
