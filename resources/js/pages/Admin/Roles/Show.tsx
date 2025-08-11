import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Shield, Users, Key, Edit, ArrowRight } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'داشبورد ادمین',
        href: '/admin',
    },
    {
        title: 'مدیریت نقش‌ها',
        href: '/admin/roles',
    },
    {
        title: 'جزئیات نقش',
        href: '#',
    },
];

interface Permission {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface Role {
    id: number;
    name: string;
    permissions: Permission[];
    users: User[];
}

interface Props {
    role: Role;
    allPermissions: Permission[];
}

export default function Show({ role, allPermissions }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`جزئیات نقش: ${role.name}`} />
            
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid gap-4 md:grid-cols-2">
                    {/* اطلاعات نقش */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                اطلاعات نقش
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">نام نقش:</label>
                                <p className="text-lg font-semibold">{role.name}</p>
                            </div>
                            <Separator />
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">تعداد کاربران:</label>
                                <p className="text-base">{role.users.length} کاربر</p>
                            </div>
                            <Separator />
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">تعداد مجوزها:</label>
                                <p className="text-base">{role.permissions.length} مجوز</p>
                            </div>
                            <Separator />
                            <div className="flex gap-2 pt-4">
                                <Button asChild>
                                    <Link href={route('admin.roles.edit', role.id)}>
                                        <Edit className="h-4 w-4 mr-2" />
                                        ویرایش نقش
                                    </Link>
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href={route('admin.roles.index')}>
                                        <ArrowRight className="h-4 w-4 mr-2" />
                                        بازگشت
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* مجوزهای نقش */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Key className="h-5 w-5" />
                                مجوزهای نقش
                            </CardTitle>
                            <CardDescription>
                                مجوزهایی که این نقش دارد
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 max-h-96 overflow-y-auto">
                                {role.permissions.map((permission) => (
                                    <Badge key={permission.id} variant="secondary" className="mr-1 mb-1">
                                        {permission.name}
                                    </Badge>
                                ))}
                                {role.permissions.length === 0 && (
                                    <p className="text-muted-foreground">این نقش هیچ مجوزی ندارد.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* کاربران دارای این نقش */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            کاربران دارای این نقش
                        </CardTitle>
                        <CardDescription>
                            لیست کاربرانی که این نقش را دارند
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {role.users.length > 0 ? (
                            <div className="border rounded-lg">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>نام</TableHead>
                                            <TableHead>ایمیل</TableHead>
                                            <TableHead className="text-left">عملیات</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {role.users.map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell className="font-medium">{user.name}</TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell className="text-left">
                                                    <Button size="sm" variant="outline" asChild>
                                                        <Link href={route('admin.users.show', user.id)}>
                                                            مشاهده
                                                        </Link>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <p className="text-muted-foreground">هیچ کاربری این نقش را ندارد.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}