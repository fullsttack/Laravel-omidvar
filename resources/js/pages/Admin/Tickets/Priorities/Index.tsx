import {useForm, router } from "@inertiajs/react";
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

interface PriorityData {
  id: number;
  name: string;
  status: boolean;
  created_at: string;
  updated_at: string;
  tickets_count: number;
}

interface Props {
  priorities: {
    data: PriorityData[];
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
    title: 'اولویت‌ها',
    href: '/admin/ticket-priorities',
  },
];

export default function Index({ priorities, stats, filters }: Props) {
  const [selectedPriorities, setSelectedPriorities] = useState<number[]>([]);
  const [editingPriority, setEditingPriority] = useState<PriorityData | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const [activeTab, setActiveTab] = useState(filters.status || "all");

  const { setData, post, processing} = useForm({
    ids: [] as number[],
    action: '',
  });

  const { data: priorityData, setData: setPriorityData, post: postPriority, put: putPriority, processing: priorityProcessing, errors: priorityErrors, reset: resetPriority } = useForm({
    name: '',
    status: true,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    if (activeTab !== 'all') params.append('status', activeTab);
    
    router.visit(`/admin/ticket-priorities?${params.toString()}`, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    if (value !== 'all') params.append('status', value);
    
    router.visit(`/admin/ticket-priorities?${params.toString()}`, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleBulkAction = (action: string) => {
    if (selectedPriorities.length === 0) {
      toast.error('لطفا حداقل یک اولویت را انتخاب کنید');
      return;
    }

    setData({ ids: selectedPriorities, action });
    post('/admin/ticket-priorities/bulk-update', {
      onSuccess: () => {
        toast.success('عملیات با موفقیت انجام شد');
        setSelectedPriorities([]);
      },
      onError: () => {
        toast.error('خطا در انجام عملیات');
      },
    });
  };

  const handlePriorityAction = (priorityId: number, action: string) => {
    const actionMap: { [key: string]: { status?: boolean } } = {
      'activate': { status: true },
      'deactivate': { status: false },
    };

    const updateData = actionMap[action];
    if (!updateData) return;

    router.patch(`/admin/ticket-priorities/${priorityId}`, updateData, {
      preserveScroll: true,
      onSuccess: () => {
        toast.success('اولویت با موفقیت به‌روزرسانی شد');
      },
      onError: () => {
        toast.error('خطا در به‌روزرسانی اولویت');
      },
    });
  };

  const handleDelete = (priorityId: number) => {
    if (confirm('آیا از حذف این اولویت اطمینان دارید؟')) {
      router.delete(`/admin/ticket-priorities/${priorityId}`, {
        preserveScroll: true,
        onSuccess: () => {
          toast.success('اولویت با موفقیت حذف شد');
        },
        onError: (errors) => {
          toast.error(errors.message || 'خطا در حذف اولویت');
        },
      });
    }
  };

  const handleCreatePriority = (e: React.FormEvent) => {
    e.preventDefault();
    postPriority('/admin/ticket-priorities', {
      onSuccess: () => {
        toast.success('اولویت با موفقیت ایجاد شد');
        setIsCreateDialogOpen(false);
        resetPriority();
      },
      onError: () => {
        toast.error('خطا در ایجاد اولویت');
      },
    });
  };

  const handleEditPriority = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPriority) return;

    putPriority(`/admin/ticket-priorities/${editingPriority.id}`, {
      onSuccess: () => {
        toast.success('اولویت با موفقیت ویرایش شد');
        setIsEditDialogOpen(false);
        setEditingPriority(null);
        resetPriority();
      },
      onError: () => {
        toast.error('خطا در ویرایش اولویت');
      },
    });
  };

  const openEditDialog = (priority: PriorityData) => {
    setEditingPriority(priority);
    setPriorityData({
      name: priority.name,
      status: priority.status,
    });
    setIsEditDialogOpen(true);
  };

  const togglePrioritySelection = (priorityId: number) => {
    setSelectedPriorities(prev =>
      prev.includes(priorityId)
        ? prev.filter(id => id !== priorityId)
        : [...prev, priorityId]
    );
  };

  const toggleAllPriorities = () => {
    if (selectedPriorities.length === priorities.data.length) {
      setSelectedPriorities([]);
    } else {
      setSelectedPriorities(priorities.data.map(priority => priority.id));
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      

      <div className="w-full container mx-auto max-w-7xl mt-12 space-y-6">
        <div className="flex items-center justify-end">
       
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            افزودن اولویت جدید
          </Button>
        </div>


        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="flex gap-4 mb-6">
              <div className="flex-1">
                <Input
                  placeholder="جستجو در نام اولویت..."
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
                <TabsTrigger value="all">همه ({stats.total})</TabsTrigger>
                <TabsTrigger value="active">فعال ({stats.active})</TabsTrigger>
                <TabsTrigger value="inactive">غیرفعال ({stats.inactive})</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-4">
                {selectedPriorities.length > 0 && (
                  <div className="mb-4 p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-between">
                      <span>{selectedPriorities.length} اولویت انتخاب شده</span>
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
                        <TableHead className="w-12">
                          <Checkbox
                            checked={selectedPriorities.length === priorities.data.length}
                            onCheckedChange={toggleAllPriorities}
                          />
                        </TableHead>
                        <TableHead>نام</TableHead>
                        <TableHead>وضعیت</TableHead>
                        <TableHead>تعداد تیکت‌ها</TableHead>
                        <TableHead>تاریخ ایجاد</TableHead>
                        <TableHead className="w-12"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {priorities.data.map((priority) => (
                        <TableRow key={priority.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedPriorities.includes(priority.id)}
                              onCheckedChange={() => togglePrioritySelection(priority.id)}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{priority.name}</TableCell>
                          <TableCell>
                            {priority.status ? (
                              <Badge variant="default">فعال</Badge>
                            ) : (
                              <Badge variant="secondary">غیرفعال</Badge>
                            )}
                          </TableCell>
                          <TableCell>{priority.tickets_count}</TableCell>
                          <TableCell>
                            {new Date(priority.created_at).toLocaleDateString('fa-IR')}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>عملیات</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => openEditDialog(priority)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  ویرایش
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handlePriorityAction(priority.id, priority.status ? 'deactivate' : 'activate')}>
                                  {priority.status ? (
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
                                  onClick={() => handleDelete(priority.id)}
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

                {priorities.data.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">اولویتی یافت نشد</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Create Priority Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>افزودن اولویت جدید</DialogTitle>
            <DialogDescription>
              اطلاعات اولویت جدید را وارد کنید.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreatePriority}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">نام</Label>
                <Input
                  id="name"
                  value={priorityData.name}
                  onChange={(e) => setPriorityData('name', e.target.value)}
                  className="col-span-3"
                  placeholder="نام اولویت"
                />
                {priorityErrors.name && <p className="text-red-500 text-sm col-span-4">{priorityErrors.name}</p>}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">وضعیت</Label>
                <Switch
                  id="status"
                  checked={priorityData.status}
                  onCheckedChange={(checked) => setPriorityData('status', checked)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                انصراف
              </Button>
              <Button type="submit" disabled={priorityProcessing}>
                ایجاد اولویت
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Priority Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ویرایش اولویت</DialogTitle>
            <DialogDescription>
              اطلاعات اولویت را ویرایش کنید.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditPriority}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">نام</Label>
                <Input
                  id="edit-name"
                  value={priorityData.name}
                  onChange={(e) => setPriorityData('name', e.target.value)}
                  className="col-span-3"
                  placeholder="نام اولویت"
                />
                {priorityErrors.name && <p className="text-red-500 text-sm col-span-4">{priorityErrors.name}</p>}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-status" className="text-right">وضعیت</Label>
                <Switch
                  id="edit-status"
                  checked={priorityData.status}
                  onCheckedChange={(checked) => setPriorityData('status', checked)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                انصراف
              </Button>
              <Button type="submit" disabled={priorityProcessing}>
                ذخیره تغییرات
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}