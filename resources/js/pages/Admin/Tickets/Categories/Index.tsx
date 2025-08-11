import { Head, useForm, router } from "@inertiajs/react";
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CheckCircle,
  Search,
  Trash2,
  MoreHorizontal,
  Edit,
  Plus,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CategoryData {
  id: number;
  name: string;
  status: boolean;
  created_at: string;
  updated_at: string;
  tickets_count: number;
}

interface Props {
  categories: {
    data: CategoryData[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  stats: {
    total: number;
    active: number;
    inactive: number;
  };
  filters: {
    status?: string;
    search?: string;
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'داشبورد ادمین',
    href: '/admin',
  },
  {
    title: 'تیکت‌ها',
    href: '/admin/tickets',
  },
  {
    title: 'دسته‌بندی‌ها',
    href: '/admin/ticket-categories',
  },
];

export default function Index({ categories, filters }: Props) {
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [editingCategory, setEditingCategory] = useState<CategoryData | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const [activeTab, setActiveTab] = useState(filters.status || "all");

  const { setData, post, processing} = useForm({
    ids: [] as number[],
    action: '',
  });

  const { data: categoryData, setData: setCategoryData, post: postCategory, put: putCategory, processing: categoryProcessing, errors: categoryErrors, reset: resetCategory } = useForm({
    name: '',
    status: true,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    if (activeTab !== 'all') params.append('status', activeTab);
    
    router.visit(`/admin/ticket-categories?${params.toString()}`, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    if (value !== 'all') params.append('status', value);
    
    router.visit(`/admin/ticket-categories?${params.toString()}`, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleBulkAction = (action: string) => {
    if (selectedCategories.length === 0) {
      toast.error('لطفا حداقل یک دسته‌بندی را انتخاب کنید');
      return;
    }

    setData({ ids: selectedCategories, action });
    post('/admin/ticket-categories/bulk-update', {
      onSuccess: () => {
        toast.success('عملیات با موفقیت انجام شد');
        setSelectedCategories([]);
      },
      onError: () => {
        toast.error('خطا در انجام عملیات');
      },
    });
  };

  const handleCategoryAction = (categoryId: number, action: string) => {
    const actionMap: { [key: string]: { status?: boolean } } = {
      'activate': { status: true },
      'deactivate': { status: false },
    };

    const updateData = actionMap[action];
    if (!updateData) return;

    router.patch(`/admin/ticket-categories/${categoryId}`, updateData, {
      preserveScroll: true,
      onSuccess: () => {
        toast.success('دسته‌بندی با موفقیت به‌روزرسانی شد');
      },
      onError: () => {
        toast.error('خطا در به‌روزرسانی دسته‌بندی');
      },
    });
  };

  const handleDelete = (categoryId: number) => {
    if (confirm('آیا از حذف این دسته‌بندی اطمینان دارید؟')) {
      router.delete(`/admin/ticket-categories/${categoryId}`, {
        preserveScroll: true,
        onSuccess: () => {
          toast.success('دسته‌بندی با موفقیت حذف شد');
        },
        onError: (errors) => {
          toast.error(errors.message || 'خطا در حذف دسته‌بندی');
        },
      });
    }
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    postCategory('/admin/ticket-categories', {
      onSuccess: () => {
        toast.success('دسته‌بندی با موفقیت ایجاد شد');
        setIsCreateDialogOpen(false);
        resetCategory();
      },
      onError: () => {
        toast.error('خطا در ایجاد دسته‌بندی');
      },
    });
  };

  const handleEditCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    putCategory(`/admin/ticket-categories/${editingCategory.id}`, {
      onSuccess: () => {
        toast.success('دسته‌بندی با موفقیت ویرایش شد');
        setIsEditDialogOpen(false);
        setEditingCategory(null);
        resetCategory();
      },
      onError: () => {
        toast.error('خطا در ویرایش دسته‌بندی');
      },
    });
  };

  const openEditDialog = (category: CategoryData) => {
    setEditingCategory(category);
    setCategoryData({
      name: category.name,
      status: category.status,
    });
    setIsEditDialogOpen(true);
  };

  const toggleCategorySelection = (categoryId: number) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleAllCategories = () => {
    if (selectedCategories.length === categories.data.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(categories.data.map(category => category.id));
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="مدیریت دسته‌بندی‌های تیکت" />

      <div className="w-full container mx-auto max-w-7xl mt-12 space-y-6">
        <div className="flex items-center justify-end">
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            افزودن دسته‌بندی جدید
          </Button>
        </div>


        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="flex gap-4 mb-6">
              <div className="flex-1">
                <Input
                  placeholder="جستجو در نام دسته‌بندی..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button type="submit">
                <Search className="h-4 w-4 mr-2" />
                جستجو
              </Button>
            </form>

            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList>
                <TabsTrigger value="all">همه</TabsTrigger>
                <TabsTrigger value="active">فعال</TabsTrigger>
                <TabsTrigger value="inactive">غیرفعال</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-4">
                {selectedCategories.length > 0 && (
                  <div className="mb-4 p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-between">
                      <span>{selectedCategories.length} دسته‌بندی انتخاب شده</span>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleBulkAction('activate')}
                          disabled={processing}
                        >
                          فعال کردن
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleBulkAction('deactivate')}
                          disabled={processing}
                        >
                          غیرفعال کردن
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleBulkAction('delete')}
                          disabled={processing}
                        >
                          حذف
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12 text-right">
                          <Checkbox
                            checked={selectedCategories.length === categories.data.length}
                            onCheckedChange={toggleAllCategories}
                          />
                        </TableHead>
                        <TableHead className="text-right">نام</TableHead>
                        <TableHead className="text-right">وضعیت</TableHead>
                        <TableHead className="text-right">تعداد تیکت‌ها</TableHead>
                        <TableHead className="text-right">تاریخ ایجاد</TableHead>
                        <TableHead className="w-12 text-right"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categories.data.map((category) => (
                        <TableRow key={category.id}>
                          <TableCell className="text-right">
                            <Checkbox
                              checked={selectedCategories.includes(category.id)}
                              onCheckedChange={() => toggleCategorySelection(category.id)}
                            />
                          </TableCell>
                          <TableCell className="font-medium text-right">{category.name}</TableCell>
                          <TableCell className="text-right">
                            {category.status ? (
                              <Badge variant="default">فعال</Badge>
                            ) : (
                              <Badge variant="secondary">غیرفعال</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">{category.tickets_count}</TableCell>
                          <TableCell className="text-right">
                            {new Date(category.created_at).toLocaleDateString('fa-IR')}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>عملیات</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => openEditDialog(category)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  ویرایش
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleCategoryAction(category.id, category.status ? 'deactivate' : 'activate')}>
                                  {category.status ? (
                                    <>
                                      <X className="mr-2 h-4 w-4" />
                                      غیرفعال کردن
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle className="mr-2 h-4 w-4" />
                                      فعال کردن
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={() => handleDelete(category.id)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  حذف
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {categories.data.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">دسته‌بندی‌ای یافت نشد</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Create Category Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>افزودن دسته‌بندی جدید</DialogTitle>
            <DialogDescription>
              اطلاعات دسته‌بندی جدید را وارد کنید.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateCategory}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">نام</Label>
                <Input
                  id="name"
                  value={categoryData.name}
                  onChange={(e) => setCategoryData('name', e.target.value)}
                  className="col-span-3"
                  placeholder="نام دسته‌بندی"
                />
                {categoryErrors.name && <p className="text-red-500 text-sm col-span-4">{categoryErrors.name}</p>}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">وضعیت</Label>
                <Switch
                  id="status"
                  checked={categoryData.status}
                  onCheckedChange={(checked) => setCategoryData('status', checked)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                انصراف
              </Button>
              <Button type="submit" disabled={categoryProcessing}>
                ایجاد دسته‌بندی
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ویرایش دسته‌بندی</DialogTitle>
            <DialogDescription>
              اطلاعات دسته‌بندی را ویرایش کنید.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditCategory}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">نام</Label>
                <Input
                  id="edit-name"
                  value={categoryData.name}
                  onChange={(e) => setCategoryData('name', e.target.value)}
                  className="col-span-3"
                  placeholder="نام دسته‌بندی"
                />
                {categoryErrors.name && <p className="text-red-500 text-sm col-span-4">{categoryErrors.name}</p>}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-status" className="text-right">وضعیت</Label>
                <Switch
                  id="edit-status"
                  checked={categoryData.status}
                  onCheckedChange={(checked) => setCategoryData('status', checked)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                انصراف
              </Button>
              <Button type="submit" disabled={categoryProcessing}>
                ذخیره تغییرات
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}