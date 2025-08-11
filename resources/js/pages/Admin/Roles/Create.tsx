import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Shield, ArrowRight } from 'lucide-react';
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
    {
        title: 'نقش جدید',
        href: '#',
    },
];

interface Permission {
    id: number;
    name: string;
}

interface Props {
    permissions: Permission[];
}

export default function Create({ permissions }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        permissions: [] as string[],
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.roles.store'), {
            onSuccess: () => {
                toast.success('عملیات موفق', { description: `نقش "${data.name}" با موفقیت ایجاد شد` });
            },
            onError: () => {
                toast.error('عملیات ناموفق', { description: 'خطا در ایجاد نقش' });
            }
        });
    };

    const togglePermission = (permissionName: string) => {
        setData('permissions', 
            data.permissions.includes(permissionName)
                ? data.permissions.filter(p => p !== permissionName)
                : [...data.permissions, permissionName]
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="ایجاد نقش جدید" />
            
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 max-w-7xl mx-auto w-full">
                <Card className="max-w-4xl mx-auto">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            ایجاد نقش جدید
                        </CardTitle>
                        <CardDescription>
                            نقش جدید برای سیستم تعریف کنید و مجوزهای آن را انتخاب کنید
                        </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">نام نقش</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="مثال: editor"
                                    className={errors.name ? 'border-destructive' : ''}
                                />
                                {errors.name && (
                                    <p className="text-sm text-destructive">{errors.name}</p>
                                )}
                            </div>

                            <div className="space-y-4">
                                <Label>مجوزها</Label>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border rounded-lg">
                                    {permissions.map((permission) => (
                                        <div key={permission.id} className="flex items-center space-x-2 rtl:space-x-reverse">
                                            <Checkbox
                                                id={`permission-${permission.id}`}
                                                checked={data.permissions.includes(permission.name)}
                                                onCheckedChange={() => togglePermission(permission.name)}
                                            />
                                            <Label 
                                                htmlFor={`permission-${permission.id}`}
                                                className="text-sm font-normal cursor-pointer"
                                            >
                                                {permission.name}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                                {errors.permissions && (
                                    <p className="text-sm text-destructive">{errors.permissions}</p>
                                )}
                            </div>

                            <div className="flex gap-2 pt-4">
                                <Button type="submit" disabled={processing}>
                                    ایجاد نقش
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href={route('admin.roles.index')}>
                                        <ArrowRight className="h-4 w-4 mr-2" />
                                        بازگشت
                                    </Link>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}