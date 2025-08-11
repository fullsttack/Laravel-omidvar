import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Search, UserPlus, Users, Settings, Eye } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'داشبورد ادمین',
        href: '/admin',
    },
    {
        title: 'مدیریت کاربران',
        href: '/admin/users',
    },
];

interface User {
    id: number;
    name: string;
    email: string;
    mobile: string | null;
    created_at: string;
    roles: Array<{
        id: number;
        name: string;
    }>;
}

interface Role {
    id: number;
    name: string;
}

interface Props {
    users: {
        data: User[];
        links: any[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    roles: Role[];
    filters: {
        search?: string;
        role?: string;
    };
}

export default function Index({ users, roles, filters }: Props) {
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
    
    const { data, setData, get, processing } = useForm({
        search: filters.search || '',
        role: filters.role || 'all',
    });

    const handleSearch = () => {
        get(route('admin.users.index'), {
            preserveState: true,
            replace: true,
        });
    };

    const handleBulkAction = (action: string, role: string) => {
        if (selectedUsers.length === 0) {
            toast.error('انتخاب نشده', { description: 'لطفا حداقل یک کاربر انتخاب کنید.' });
            return;
        }

        router.post(route('admin.users.bulk-update'), {
            users: selectedUsers,
            action,
            role,
        }, {
            onSuccess: () => {
                setSelectedUsers([]);
                toast.success('عملیات موفق', { 
                    description: `عملیات ${action === 'assign_role' ? 'اختصاص' : 'حذف'} نقش ${role} روی ${selectedUsers.length} کاربر با موفقیت انجام شد` 
                });
            },
            onError: () => {
                toast.error('عملیات ناموفق', { description: 'خطا در انجام عملیات گروهی' });
            }
        });
    };

    const toggleUser = (userId: number) => {
        setSelectedUsers(prev => 
            prev.includes(userId) 
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const toggleAllUsers = () => {
        setSelectedUsers(prev => 
            prev.length === users.data.length 
                ? []
                : users.data.map(user => user.id)
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="مدیریت کاربران" />
            
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 max-w-7xl mx-auto w-full">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                مدیریت کاربران
                            </CardTitle>
                            <CardDescription>
                                مجموع {users.total} کاربر
                            </CardDescription>
                        </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                        {/* فیلترها */}
                        <div className="flex gap-4 items-end">
                            <div className="flex-1">
                                <Input
                                    placeholder="جستجو در نام، ایمیل یا موبایل..."
                                    value={data.search}
                                    onChange={(e) => setData('search', e.target.value)}
                                />
                            </div>
                            <div className="w-48">
                                <Select value={data.role} onValueChange={(value) => setData('role', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="فیلتر نقش" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">همه نقش‌ها</SelectItem>
                                        {roles.map((role) => (
                                            <SelectItem key={role.id} value={role.name}>
                                                {role.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button onClick={handleSearch} disabled={processing}>
                                <Search className="h-4 w-4 mr-2" />
                                جستجو
                            </Button>
                        </div>

                        {/* عملیات گروهی */}
                        {selectedUsers.length > 0 && (
                            <div className="flex gap-2 p-3 bg-muted rounded-lg">
                                <span className="text-sm">{selectedUsers.length} کاربر انتخاب شده</span>
                                <div className="flex gap-2 mr-auto">
                                    {roles.map((role) => (
                                        <div key={role.id} className="flex gap-1">
                                            <Button 
                                                size="sm" 
                                                variant="outline"
                                                onClick={() => handleBulkAction('assign_role', role.name)}
                                            >
                                                اختصاص نقش {role.name}
                                            </Button>
                                            <Button 
                                                size="sm" 
                                                variant="outline"
                                                onClick={() => handleBulkAction('remove_role', role.name)}
                                            >
                                                حذف نقش {role.name}
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* جدول */}
                        <div className="border rounded-lg">
                            <Table className="text-right">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-12 text-right">
                                            <input
                                                type="checkbox"
                                                checked={selectedUsers.length === users.data.length}
                                                onChange={toggleAllUsers}
                                                className="rounded"
                                            />
                                        </TableHead>
                                        <TableHead className="text-right">نام</TableHead>
                                        <TableHead className="text-right">ایمیل</TableHead>
                                        <TableHead className="text-right">موبایل</TableHead>
                                        <TableHead className="text-right">نقش‌ها</TableHead>
                                        <TableHead className="text-right">تاریخ عضویت</TableHead>
                                        <TableHead className="text-right">عملیات</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.data.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedUsers.includes(user.id)}
                                                    onChange={() => toggleUser(user.id)}
                                                    className="rounded"
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium">{user.name}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>{user.mobile || '-'}</TableCell>
                                            <TableCell>
                                                <div className="flex gap-1 flex-wrap">
                                                    {user.roles.map((role) => (
                                                        <Badge key={role.id} variant="secondary">
                                                            {role.name}
                                                        </Badge>
                                                    ))}
                                                    {user.roles.length === 0 && (
                                                        <Badge variant="outline">بدون نقش</Badge>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {new Date(user.created_at).toLocaleDateString('fa-IR')}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex gap-1">
                                                    <Button size="sm" variant="outline" asChild>
                                                        <Link href={route('admin.users.show', user.id)}>
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* صفحه‌بندی */}
                        {users.last_page > 1 && (
                            <div className="flex justify-center gap-2">
                                {users.links.map((link, index) => (
                                    <Button
                                        key={index}
                                        variant={link.active ? "default" : "outline"}
                                        size="sm"
                                        disabled={!link.url}
                                        onClick={() => link.url && router.get(link.url)}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}