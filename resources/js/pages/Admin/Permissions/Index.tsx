import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Search, Plus, Key, Shield, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'داشبورد ادمین',
        href: '/admin',
    },
    {
        title: 'مدیریت مجوزها',
        href: '/admin/permissions',
    },
];

interface Role {
    id: number;
    name: string;
}

interface Permission {
    id: number;
    name: string;
    roles: Role[];
}

interface Props {
    permissions: {
        data: Permission[];
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

export default function Index({ permissions, filters }: Props) {
    const { data, setData, get, processing } = useForm({
        search: filters.search || '',
    });

    const handleSearch = () => {
        get(route('admin.permissions.index'), {
            preserveState: true,
            replace: true,
        });
    };

    const deletePermission = (permissionId: number, permissionName: string) => {
        if (confirm(`آیا مطمئن هستید که می‌خواهید مجوز "${permissionName}" را حذف کنید؟`)) {
            router.delete(route('admin.permissions.destroy', permissionId), {
                onSuccess: () => {
                    toast.success('عملیات موفق', { description: `مجوز "${permissionName}" با موفقیت حذف شد` });
                },
                onError: () => {
                    toast.error('عملیات ناموفق', { description: 'خطا در حذف مجوز' });
                }
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="مدیریت مجوزها" />
            
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 max-w-7xl mx-auto w-full">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Key className="h-5 w-5" />
                                مدیریت مجوزها
                            </CardTitle>
                            <CardDescription>
                                مجموع {permissions.total} مجوز
                            </CardDescription>
                        </div>
                        <Button asChild>
                            <Link href={route('admin.permissions.create')}>
                                <Plus className="h-4 w-4 mr-2" />
                                مجوز جدید
                            </Link>
                        </Button>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                        {/* جستجو */}
                        <div className="flex gap-4 items-end">
                            <div className="flex-1">
                                <Input
                                    placeholder="جستجو در نام مجوز..."
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
                                        <TableHead className="text-right">نام مجوز</TableHead>
                                        <TableHead className="text-right">استفاده در نقش‌ها</TableHead>
                                        <TableHead className="text-right">عملیات</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {permissions.data.map((permission) => (
                                        <TableRow key={permission.id}>
                                            <TableCell className="font-medium">{permission.name}</TableCell>
                                            <TableCell>
                                                <div className="flex gap-1 flex-wrap max-w-md">
                                                    {permission.roles.slice(0, 3).map((role) => (
                                                        <Badge key={role.id} variant="secondary" className="flex items-center gap-1">
                                                            <Shield className="h-3 w-3" />
                                                            {role.name}
                                                        </Badge>
                                                    ))}
                                                    {permission.roles.length > 3 && (
                                                        <Badge variant="secondary">
                                                            +{permission.roles.length - 3} بیشتر
                                                        </Badge>
                                                    )}
                                                    {permission.roles.length === 0 && (
                                                        <Badge variant="outline">استفاده نشده</Badge>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex gap-1">
                                                    <Button size="sm" variant="outline" asChild>
                                                        <Link href={route('admin.permissions.edit', permission.id)}>
                                                            <Edit className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button 
                                                        size="sm" 
                                                        variant="outline"
                                                        onClick={() => deletePermission(permission.id, permission.name)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* صفحه‌بندی */}
                        {permissions.last_page > 1 && (
                            <div className="flex justify-center gap-2">
                                {permissions.links.map((link, index) => (
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