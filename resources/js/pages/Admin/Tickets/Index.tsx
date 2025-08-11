import { Head, Link, useForm, router } from "@inertiajs/react";
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  Eye,
  Search,
  Trash2,
  MoreHorizontal,
  AlertCircle,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface TicketUser {
  id: number;
  name: string;
  email: string;
  mobile: string;
}

interface TicketCategory {
  id: number;
  name: string;
  status: boolean;
}

interface TicketPriority {
  id: number;
  name: string;
  status: boolean;
}

interface TicketAdmin {
  id: number;
  user: TicketUser;
}

interface TicketData {
  id: number;
  subject: string;
  description: string;
  status: number;
  seen: boolean;
  created_at: string;
  updated_at: string;
  user: TicketUser;
  category: TicketCategory;
  priority: TicketPriority;
  admin: TicketAdmin;
}

interface Props {
  tickets: {
    data: TicketData[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  stats: {
    total: number;
    open: number;
    closed: number;
    answered: number;
    unseen: number;
  };
  categories: TicketCategory[];
  priorities: TicketPriority[];
  filters: {
    status?: string;
    seen?: string;
    search?: string;
    category_id?: string;
    priority_id?: string;
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
];

const getStatusBadge = (status: number) => {
  switch (status) {
    case 0:
      return <Badge variant="destructive">باز</Badge>;
    case 1:
      return <Badge variant="secondary">بسته</Badge>;
    case 2:
      return <Badge variant="default">پاسخ داده شده</Badge>;
    default:
      return <Badge variant="outline">نامشخص</Badge>;
  }
};

export default function Index({ tickets, stats, categories, priorities, filters }: Props) {
  const [selectedTickets, setSelectedTickets] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const [activeTab, setActiveTab] = useState(filters.status || "all");
  const [selectedCategory, setSelectedCategory] = useState(filters.category_id || "all");
  const [selectedPriority, setSelectedPriority] = useState(filters.priority_id || "all");

  const { setData, post, processing } = useForm({
    ids: [] as number[],
    action: '',
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    if (activeTab !== 'all') params.append('status', activeTab);
    if (selectedCategory !== 'all') params.append('category_id', selectedCategory);
    if (selectedPriority !== 'all') params.append('priority_id', selectedPriority);
    
    router.visit(`/admin/tickets?${params.toString()}`, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    if (value !== 'all') params.append('status', value);
    if (selectedCategory !== 'all') params.append('category_id', selectedCategory);
    if (selectedPriority !== 'all') params.append('priority_id', selectedPriority);
    
    router.visit(`/admin/tickets?${params.toString()}`, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleFilterChange = (type: 'category' | 'priority', value: string) => {
    if (type === 'category') {
      setSelectedCategory(value);
    } else {
      setSelectedPriority(value);
    }

    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    if (activeTab !== 'all') params.append('status', activeTab);
    if (type === 'category') {
      if (value !== 'all') params.append('category_id', value);
      if (selectedPriority !== 'all') params.append('priority_id', selectedPriority);
    } else {
      if (selectedCategory !== 'all') params.append('category_id', selectedCategory);
      if (value !== 'all') params.append('priority_id', value);
    }
    
    router.visit(`/admin/tickets?${params.toString()}`, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleBulkAction = (action: string) => {
    if (selectedTickets.length === 0) {
      toast.error('لطفا حداقل یک تیکت را انتخاب کنید');
      return;
    }

    setData({ ids: selectedTickets, action });
    post('/admin/tickets/bulk-update', {
      onSuccess: () => {
        toast.success('عملیات با موفقیت انجام شد');
        setSelectedTickets([]);
      },
      onError: () => {
        toast.error('خطا در انجام عملیات');
      },
    });
  };

  const handleTicketAction = (ticketId: number, action: string) => {
    const actionMap: { [key: string]: { status?: number; seen?: boolean } } = {
      'open': { status: 0 },
      'close': { status: 1 },
      'answer': { status: 2 },
      'mark_seen': { seen: true },
    };

    const updateData = actionMap[action];
    if (!updateData) return;

    router.patch(`/admin/tickets/${ticketId}`, updateData, {
      preserveScroll: true,
      onSuccess: () => {
        toast.success('تیکت با موفقیت به‌روزرسانی شد');
      },
      onError: () => {
        toast.error('خطا در به‌روزرسانی تیکت');
      },
    });
  };

  const handleDelete = (ticketId: number) => {
    if (confirm('آیا از حذف این تیکت اطمینان دارید?')) {
      router.delete(`/admin/tickets/${ticketId}`, {
        preserveScroll: true,
        onSuccess: () => {
          toast.success('تیکت با موفقیت حذف شد');
        },
        onError: () => {
          toast.error('خطا در حذف تیکت');
        },
      });
    }
  };

  const toggleTicketSelection = (ticketId: number) => {
    setSelectedTickets(prev =>
      prev.includes(ticketId)
        ? prev.filter(id => id !== ticketId)
        : [...prev, ticketId]
    );
  };

  const toggleAllTickets = () => {
    if (selectedTickets.length === tickets.data.length) {
      setSelectedTickets([]);
    } else {
      setSelectedTickets(tickets.data.map(ticket => ticket.id));
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="مدیریت تیکت‌ها" />

      <div className="w-full container mx-auto max-w-7xl mt-12 space-y-6">

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">فیلترها</h2>
            </div>

            <form onSubmit={handleSearch} className="flex gap-4 mb-6">
              <div className="flex-1">
                <Input
                  placeholder="جستجو در موضوع، توضیحات و کاربران..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={selectedCategory} onValueChange={(value) => handleFilterChange('category', value)}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="دسته‌بندی" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه دسته‌بندی‌ها</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedPriority} onValueChange={(value) => handleFilterChange('priority', value)}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="اولویت" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه اولویت‌ها</SelectItem>
                  {priorities.map((priority) => (
                    <SelectItem key={priority.id} value={priority.id.toString()}>
                      {priority.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="submit">
                <Search className="h-4 w-4 mr-2" />
                جستجو
              </Button>
            </form>

            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList>
                <TabsTrigger value="all">همه ({stats.total})</TabsTrigger>
                <TabsTrigger value="open">باز ({stats.open})</TabsTrigger>
                <TabsTrigger value="answered">پاسخ داده شده ({stats.answered})</TabsTrigger>
                <TabsTrigger value="closed">بسته ({stats.closed})</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-4">
                {selectedTickets.length > 0 && (
                  <div className="mb-4 p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-between">
                      <span>{selectedTickets.length} تیکت انتخاب شده</span>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleBulkAction('open')}
                          disabled={processing}
                        >
                          باز کردن
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleBulkAction('answer')}
                          disabled={processing}
                        >
                          پاسخ داده شده
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleBulkAction('close')}
                          disabled={processing}
                        >
                          بستن
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleBulkAction('mark_seen')}
                          disabled={processing}
                        >
                          علامت‌گذاری به عنوان خوانده‌شده
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
                            checked={selectedTickets.length === tickets.data.length}
                            onCheckedChange={toggleAllTickets}
                          />
                        </TableHead>
                        <TableHead className="text-right">موضوع</TableHead>
                        <TableHead className="text-right">کاربر</TableHead>
                        <TableHead className="text-right">دسته‌بندی</TableHead>
                        <TableHead className="text-right">اولویت</TableHead>
                        <TableHead className="text-right">وضعیت</TableHead>
                        <TableHead className="text-right">مسئول</TableHead>
                        <TableHead className="text-right">تاریخ ایجاد</TableHead>
                        <TableHead className="w-12 text-right"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tickets.data.map((ticket) => (
                        <TableRow 
                          key={ticket.id}
                          className={!ticket.seen ? 'bg-blue-50' : ''}
                        >
                          <TableCell className="text-right">
                            <Checkbox
                              checked={selectedTickets.includes(ticket.id)}
                              onCheckedChange={() => toggleTicketSelection(ticket.id)}
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <div>
                              <Link
                                href={`/admin/tickets/${ticket.id}`}
                                className="font-medium hover:underline"
                              >
                                {ticket.subject || 'بدون موضوع'}
                              </Link>
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {ticket.description}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div>
                              <div className="font-medium">{ticket.user.name}</div>
                              <div className="text-sm text-muted-foreground">{ticket.user.mobile}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge variant="outline">{ticket.category.name}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge variant="secondary">{ticket.priority.name}</Badge>
                          </TableCell>
                          <TableCell className="text-right">{getStatusBadge(ticket.status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="text-sm">{ticket.admin.user.name}</div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="text-sm">
                              {new Date(ticket.created_at).toLocaleDateString('fa-IR')}
                            </div>
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
                                <DropdownMenuItem asChild>
                                  <Link href={`/admin/tickets/${ticket.id}`}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    مشاهده
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleTicketAction(ticket.id, 'open')}>
                                  <AlertCircle className="mr-2 h-4 w-4" />
                                  باز کردن
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleTicketAction(ticket.id, 'answer')}>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  پاسخ داده شده
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleTicketAction(ticket.id, 'close')}>
                                  <X className="mr-2 h-4 w-4" />
                                  بستن
                                </DropdownMenuItem>
                                {!ticket.seen && (
                                  <DropdownMenuItem onClick={() => handleTicketAction(ticket.id, 'mark_seen')}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    علامت‌گذاری به عنوان خوانده‌شده
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={() => handleDelete(ticket.id)}
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

                {tickets.data.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">تیکتی یافت نشد</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}