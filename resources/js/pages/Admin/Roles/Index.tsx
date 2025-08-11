import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Search, Plus, Shield, Users, Eye, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'داشبورد ادمین',
        href: '/admin',
    },
    {
        title: 'مدیریت نقش‌ها',
        href: '/admin/roles',
    },
];

interface Permission {
    id: number;
    name: string;
}

interface Role {
    id: number;
    name: string;
    users_count: number;
    permissions: Permission[];
}

interface Props {
    roles: {
        data: Role[];
        links: any[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        search?: string;
    };
}

export default function Index({ roles, filters }: Props) {
    const { data, setData, get, processing } = useForm({
        search: filters.search || '',
    });

    const handleSearch = () => {
        get(route('admin.roles.index'), {
            preserveState: true,
            replace: true,
        });
    };

    const deleteRole = (roleId: number, roleName: string, usersCount: number) => {
        if (usersCount > 0) {
            toast.error('غیر مجاز', { description: 'نمی‌توان نقشی را حذف کرد که کاربران آن را دارند.' });
            return;
        }
        
        if (confirm(`آیا مطمئن هستید که می‌خواهید نقش "${roleName}" را حذف کنید؟`)) {
            router.delete(route('admin.roles.destroy', roleId), {
                onSuccess: () => {
                    toast.success('عملیات موفق', { description: `نقش "${roleName}" با موفقیت حذف شد` });
                },
                onError: () => {
                    toast.error('عملیات ناموفق', { description: 'خطا در حذف نقش' });
                }
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="مدیریت نقش‌ها" />
            
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 max-w-7xl mx-auto w-full">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                مدیریت نقش‌ها
                            </CardTitle>
                            <CardDescription>
                                مجموع {roles.total} نقش
                            </CardDescription>
                        </div>
                        <Button asChild>
                            <Link href={route('admin.roles.create')}>
                                <Plus className="h-4 w-4 mr-2" />
                                نقش جدید
                            </Link>
                        </Button>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                        {/* جستجو */}
                        <div className="flex gap-4 items-end">
                            <div className="flex-1">
                                <Input
                                    placeholder="جستجو در نام نقش..."
                                    value={data.search}
                                    onChange={(e) => setData('search', e.target.value)}
                                />
                            </div>
                            <Button onClick={handleSearch} disabled={processing}>
                                <Search className="h-4 w-4 mr-2" />
                                جستجو
                            </Button>
                        </div>

                        {/* جدول */}
                        <div className="border rounded-lg">
                            <Table className="text-right">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-right">نام نقش</TableHead>
                                        <TableHead className="text-right">تعداد کاربران</TableHead>
                                        <TableHead className="text-right">مجوزها</TableHead>
                                        <TableHead className="text-right">عملیات</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {roles.data.map((role) => (
                                        <TableRow key={role.id}>
                                            <TableCell className="font-medium">{role.name}</TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                                                    <Users className="h-3 w-3" />
                                                    {role.users_count}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-1 flex-wrap max-w-md">
                                                    {role.permissions.slice(0, 3).map((permission) => (
                                                        <Badge key={permission.id} variant="outline" className="text-xs">
                                                            {permission.name}
                                                        </Badge>
                                                    ))}
                                                    {role.permissions.length > 3 && (
                                                        <Badge variant="outline" className="text-xs">
                                                            +{role.permissions.length - 3} بیشتر
                                                        </Badge>
                                                    )}
                                                    {role.permissions.length === 0 && (
                                                        <Badge variant="outline">بدون مجوز</Badge>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex gap-1">
                                                    <Button size="sm" variant="outline" asChild>
                                                        <Link href={route('admin.roles.show', role.id)}>
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button size="sm" variant="outline" asChild>
                                                        <Link href={route('admin.roles.edit', role.id)}>
                                                            <Edit className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    {role.users_count === 0 && (
                                                        <Button 
                                                            size="sm" 
                                                            variant="outline"
                                                            onClick={() => deleteRole(role.id, role.name, role.users_count)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* صفحه‌بندی */}
                        {roles.last_page > 1 && (
                            <div className="flex justify-center gap-2">
                                {roles.links.map((link, index) => (
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