import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { User, Shield, Key, Plus, Minus } from 'lucide-react';
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
    {
        title: 'جزئیات کاربر',
        href: '#',
    },
];

interface Role {
    id: number;
    name: string;
}

interface Permission {
    id: number;
    name: string;
}

interface UserData {
    id: number;
    name: string;
    email: string;
    mobile: string | null;
    created_at: string;
    roles: Role[];
    permissions: Permission[];
}

interface Props {
    user: UserData;
    allRoles: Role[];
    allPermissions: Permission[];
}

export default function Show({ user, allRoles, allPermissions }: Props) {
    const { data: roleData, setData: setRoleData, post: postRole, processing: roleProcessing } = useForm({
        role: '',
    });

    const { data: permissionData, setData: setPermissionData, post: postPermission, processing: permissionProcessing } = useForm({
        permission: '',
    });

    const assignRole = () => {
        if (!roleData.role) return;
        
        postRole(route('admin.users.assign-role', user.id), {
            onSuccess: () => {
                setRoleData('role', '');
                toast.success('عملیات موفق', { description: `نقش ${roleData.role} به کاربر اختصاص یافت` });
            },
            onError: () => {
                toast.error('عملیات ناموفق', { description: 'خطا در اختصاص نقش' });
            }
        });
    };

    const removeRole = (roleName: string) => {
        router.post(route('admin.users.remove-role', user.id), {
            role: roleName,
        }, {
            onSuccess: () => {
                toast.success('عملیات موفق', { description: `نقش ${roleName} از کاربر حذف شد` });
            },
            onError: () => {
                toast.error('عملیات ناموفق', { description: 'خطا در حذف نقش' });
            }
        });
    };

    const givePermission = () => {
        if (!permissionData.permission) return;
        
        postPermission(route('admin.users.give-permission', user.id), {
            onSuccess: () => {
                setPermissionData('permission', '');
                toast.success('عملیات موفق', { description: `مجوز ${permissionData.permission} به کاربر داده شد` });
            },
            onError: () => {
                toast.error('عملیات ناموفق', { description: 'خطا در اعطای مجوز' });
            }
        });
    };

    const revokePermission = (permissionName: string) => {
        router.post(route('admin.users.revoke-permission', user.id), {
            permission: permissionName,
        }, {
            onSuccess: () => {
                toast.success('عملیات موفق', { description: `مجوز ${permissionName} از کاربر گرفته شد` });
            },
            onError: () => {
                toast.error('عملیات ناموفق', { description: 'خطا در گرفتن مجوز' });
            }
        });
    };

    const userRoleNames = user.roles.map(role => role.name);
    const userPermissionNames = user.permissions.map(permission => permission.name);
    const availableRoles = allRoles.filter(role => !userRoleNames.includes(role.name));
    const availablePermissions = allPermissions.filter(permission => !userPermissionNames.includes(permission.name));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`جزئیات کاربر: ${user.name}`} />
            
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 max-w-7xl mx-auto w-full">
                <div className="grid gap-4 md:grid-cols-2">
                    {/* اطلاعات کاربر */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                اطلاعات کاربر
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">نام:</label>
                                <p className="text-base">{user.name}</p>
                            </div>
                            <Separator />
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">ایمیل:</label>
                                <p className="text-base">{user.email}</p>
                            </div>
                            <Separator />
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">موبایل:</label>
                                <p className="text-base">{user.mobile || 'ندارد'}</p>
                            </div>
                            <Separator />
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">تاریخ عضویت:</label>
                                <p className="text-base">{new Date(user.created_at).toLocaleDateString('fa-IR')}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* مدیریت نقش‌ها */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                مدیریت نقش‌ها
                            </CardTitle>
                            <CardDescription>
                                نقش‌های فعلی کاربر و امکان اضافه/حذف نقش
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* نقش‌های فعلی */}
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">نقش‌های فعلی:</label>
                                <div className="flex gap-2 flex-wrap mt-2">
                                    {user.roles.map((role) => (
                                        <Badge key={role.id} variant="default" className="flex items-center gap-1">
                                            {role.name}
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-4 w-4 p-0 hover:bg-destructive/20"
                                                onClick={() => removeRole(role.name)}
                                            >
                                                <Minus className="h-3 w-3" />
                                            </Button>
                                        </Badge>
                                    ))}
                                    {user.roles.length === 0 && (
                                        <Badge variant="outline">بدون نقش</Badge>
                                    )}
                                </div>
                            </div>

                            {/* اضافه کردن نقش */}
                            {availableRoles.length > 0 && (
                                <div className="space-y-2">
                                    <Separator />
                                    <label className="text-sm font-medium text-muted-foreground">اختصاص نقش جدید:</label>
                                    <div className="flex gap-2">
                                        <Select value={roleData.role} onValueChange={(value) => setRoleData('role', value)}>
                                            <SelectTrigger className="flex-1">
                                                <SelectValue placeholder="انتخاب نقش" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableRoles.map((role) => (
                                                    <SelectItem key={role.id} value={role.name}>
                                                        {role.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Button 
                                            onClick={assignRole} 
                                            disabled={roleProcessing || !roleData.role}
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            اختصاص
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* مدیریت مجوزهای مستقیم */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Key className="h-5 w-5" />
                            مدیریت مجوزهای مستقیم
                        </CardTitle>
                        <CardDescription>
                            مجوزهای مستقیم کاربر (بدون در نظر گرفتن نقش‌ها)
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* مجوزهای فعلی */}
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">مجوزهای مستقیم فعلی:</label>
                            <div className="flex gap-2 flex-wrap mt-2">
                                {user.permissions.map((permission) => (
                                    <Badge key={permission.id} variant="secondary" className="flex items-center gap-1">
                                        {permission.name}
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-4 w-4 p-0 hover:bg-destructive/20"
                                            onClick={() => revokePermission(permission.name)}
                                        >
                                            <Minus className="h-3 w-3" />
                                        </Button>
                                    </Badge>
                                ))}
                                {user.permissions.length === 0 && (
                                    <Badge variant="outline">بدون مجوز مستقیم</Badge>
                                )}
                            </div>
                        </div>

                        {/* اضافه کردن مجوز */}
                        {availablePermissions.length > 0 && (
                            <div className="space-y-2">
                                <Separator />
                                <label className="text-sm font-medium text-muted-foreground">اعطای مجوز جدید:</label>
                                <div className="flex gap-2">
                                    <Select value={permissionData.permission} onValueChange={(value) => setPermissionData('permission', value)}>
                                        <SelectTrigger className="flex-1">
                                            <SelectValue placeholder="انتخاب مجوز" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availablePermissions.map((permission) => (
                                                <SelectItem key={permission.id} value={permission.name}>
                                                    {permission.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Button 
                                        onClick={givePermission} 
                                        disabled={permissionProcessing || !permissionData.permission}
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        اعطا
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}