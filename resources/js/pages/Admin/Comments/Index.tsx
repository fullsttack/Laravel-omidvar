import { Head, Link, useForm, router } from "@inertiajs/react";
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
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
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
import { Comment } from "@/types";
import {
  CheckCircle,
  Eye,
  MessageCircle,
  Search,
  Trash2,
  MoreHorizontal,
  Edit,
  Clock,
  AlertCircle,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  comments: {
    data: Array<Comment & {
      author: {
        id: number;
        name: string;
        email: string;
        mobile: string;
      };
    }>;
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  stats: {
    total: number;
    approved: number;
    unapproved: number;
    rejected: number;
    unseen: number;
  };
  filters: {
    status?: string;
    seen?: string;
    search?: string;
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'داشبورد ادمین',
    href: '/admin',
  },
  {
    title: 'کامنت‌ها',
    href: '/admin/comments',
  },
];

export default function Index({ comments, stats, filters }: Props) {
  const [selectedComments, setSelectedComments] = useState<number[]>([]);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const [activeTab, setActiveTab] = useState(filters.status || "all");
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const { data, setData, patch, processing, reset } = useForm({
    body: "",
    approved: 0,
    status: true,
  } as {
    body: string;
    approved: number;
    status: boolean;
  });

  const handleSelectComment = (commentId: number, checked: boolean) => {
    if (checked) {
      setSelectedComments(prev => [...prev, commentId]);
    } else {
      setSelectedComments(prev => prev.filter(id => id !== commentId));
    }
  };

  const applyFilters = (status = activeTab, search = searchTerm) => {
    const params: Record<string, string> = {};
    
    if (search) params.search = search;
    if (status !== "all") {
      if (status === "new") {
        params.seen = "0";
      } else {
        params.status = status;
      }
    }

    router.get(route("admin.comments.index"), params, {
      preserveState: true,
      replace: true,
    });
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    applyFilters(value, searchTerm);
  };

  const handleEdit = (comment: Comment) => {
    setEditingComment(comment);
    setData({
      body: comment.body,
      approved: comment.approved,
      status: Boolean(comment.status),
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingComment) return;

    patch(route("admin.comments.update", editingComment.id), {
      onSuccess: () => {
        toast.success("عملیات موفق", {
          description: "کامنت با موفقیت بروزرسانی شد"
        });
        setIsEditDialogOpen(false);
        reset();
        setEditingComment(null);
      },
      onError: () => {
        toast.error("عملیات ناموفق", {
          description: "خطا در بروزرسانی کامنت"
        });
      },
    });
  };

  const handleDelete = (commentId: number) => {
    if (!confirm("آیا مطمئن هستید که می‌خواهید این کامنت را حذف کنید؟")) {
      return;
    }

    router.delete(route("admin.comments.destroy", commentId), {
      onSuccess: () => {
        toast.success("عملیات موفق", {
          description: "کامنت با موفقیت حذف شد"
        });
        setSelectedComments(prev => prev.filter(id => id !== commentId));
      },
      onError: () => {
        toast.error("عملیات ناموفق", {
          description: "خطا در حذف کامنت"
        });
      },
    });
  };

  const handleBulkAction = (action: string) => {
    if (selectedComments.length === 0) {
      toast.error("انتخاب نشده", {
        description: "لطفا حداقل یک کامنت را انتخاب کنید"
      });
      return;
    }

    router.post(route("admin.comments.bulk-update"), {
      ids: selectedComments,
      action: action,
    }, {
      onSuccess: () => {
        toast.success("عملیات موفق", {
          description: "عملیات روی کامنت‌های انتخاب شده با موفقیت انجام شد"
        });
        setSelectedComments([]);
      },
      onError: () => {
        toast.error("عملیات ناموفق", {
          description: "خطا در انجام عملیات"
        });
      },
    });
  };

  const toggleApproval = (comment: Comment, newStatus: number) => {
    const actionKey = `toggle-${comment.id}`;
    setLoadingAction(actionKey);
    
    router.patch(route("admin.comments.update", comment.id), {
      approved: newStatus,
    }, {
      preserveScroll: true,
      onSuccess: () => {
        const statusMessages = {
          0: { title: "عملیات موفق", description: "کامنت به حالت در انتظار تغییر کرد" },
          1: { title: "عملیات موفق", description: "کامنت با موفقیت تایید شد" }, 
          2: { title: "عملیات موفق", description: "کامنت با موفقیت رد شد" }
        };
        const message = statusMessages[newStatus as keyof typeof statusMessages];
        toast.success(message.title, {
          description: message.description
        });
        setLoadingAction(null);
      },
      onError: () => {
        toast.error("عملیات ناموفق", {
          description: "خطا در تغییر وضعیت کامنت"
        });
        setLoadingAction(null);
      },
    });
  };

  const getStatusBadge = (comment: Comment) => {
    if (comment.approved === 1) {
      return <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
        <CheckCircle className="h-3 w-3 mr-1" />
        تایید شده
      </Badge>;
    } else if (comment.approved === 2) {
      return <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-100">
        <X className="h-3 w-3 mr-1" />
        رد شده
      </Badge>;
    }
    return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
      <Clock className="h-3 w-3 mr-1" />
      در انتظار
    </Badge>;
  };

  const getSeenBadge = (comment: Comment) => {
    if (!comment.seen) {
      return <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-100">
        <AlertCircle className="h-3 w-3 mr-1" />
        جدید
      </Badge>;
    }
    return null;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="مدیریت کامنت‌ها" />

      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          
          
          {/* Search */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="جستجو در کامنت‌ها..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && applyFilters(activeTab, searchTerm)}
                className="pr-8 w-80"
              />
            </div>
            <Button onClick={() => applyFilters(activeTab, searchTerm)}>
              جستجو
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              همه ({stats.total})
            </TabsTrigger>
            <TabsTrigger value="approved" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              تایید شده ({stats.approved})
            </TabsTrigger>
            <TabsTrigger value="unapproved" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              در انتظار ({stats.unapproved})
            </TabsTrigger>
            <TabsTrigger value="rejected" className="flex items-center gap-2">
              <X className="h-4 w-4" />
              رد شده ({stats.rejected})
            </TabsTrigger>
            <TabsTrigger value="new" className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              جدید ({stats.unseen})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {/* Bulk Actions */}
            {selectedComments.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{selectedComments.length} کامنت انتخاب شده</p>
                    <div className="flex items-center gap-2">
                      <Button size="sm" onClick={() => handleBulkAction("approve")}>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        تایید همه
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleBulkAction("disapprove")}>
                        <Clock className="h-4 w-4 mr-1" />
                        در انتظار
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleBulkAction("reject")}>
                        <X className="h-4 w-4 mr-1" />
                        رد همه
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleBulkAction("mark_seen")}>
                        <Eye className="h-4 w-4 mr-1" />
                        علامت‌گذاری خوانده شده
                      </Button>
                      <Separator orientation="vertical" className="h-6" />
                      <Button size="sm" variant="destructive" onClick={() => handleBulkAction("delete")}>
                        <Trash2 className="h-4 w-4 mr-1" />
                        حذف همه
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Comments Table */}
            <Card>
              
              <CardContent className="p-0 overflow-x-auto">
                {comments.data.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">کامنتی موجود نیست</h3>
                    <p className="text-muted-foreground">هیچ کامنتی با این فیلتر یافت نشد.</p>
                  </div>
                ) : (
                  <div className="w-full" dir="rtl">
                    <Table className="w-full table-fixed">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16 text-center">#</TableHead>
                        <TableHead className="text-right">کاربر</TableHead>
                        <TableHead className="text-right">متن کامنت</TableHead>
                        <TableHead className="text-right">وضعیت</TableHead>
                        <TableHead className="text-right">تاریخ</TableHead>
                        <TableHead className="w-32 text-right">عملیات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {comments.data.map((comment) => (
                        <TableRow key={comment.id} className="group hover:bg-muted/50">
                          <TableCell className="text-center">
                            <div className="flex justify-center">
                              <Checkbox
                                checked={selectedComments.includes(comment.id)}
                                onCheckedChange={(checked) => handleSelectComment(comment.id, checked as boolean)}
                              />
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-start gap-2">
                              <div className="flex flex-col">
                                <span className="font-medium">{comment.author.mobile}</span>
                                <span className="text-xs text-muted-foreground">{comment.author.name}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="max-w-md">
                              <p className="text-sm line-clamp-2 leading-relaxed">
                                {comment.body.split(' ').slice(0, 4).join(' ')}
                                {comment.body.split(' ').length > 4 ? '...' : ''}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className="text-xs">
                                  {comment.commentable_type}#{comment.commentable_id}
                                </Badge>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex flex-col gap-1 items-start">
                              {getStatusBadge(comment)}
                              {getSeenBadge(comment)}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <time className="text-sm text-muted-foreground">
                              {formatDate(comment.created_at)}
                            </time>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center gap-1 justify-start">
                              {loadingAction === `toggle-${comment.id}` ? (
                                <Button variant="ghost" size="sm" disabled>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                                </Button>
                              ) : (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      {comment.approved === 1 ? (
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                      ) : comment.approved === 2 ? (
                                        <X className="h-4 w-4 text-red-600" />
                                      ) : (
                                        <Clock className="h-4 w-4 text-yellow-600" />
                                      )}
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>تغییر وضعیت</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => toggleApproval(comment, 1)}>
                                      <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                                      تایید
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => toggleApproval(comment, 0)}>
                                      <Clock className="h-4 w-4 mr-2 text-yellow-600" />
                                      در انتظار
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => toggleApproval(comment, 2)}>
                                      <X className="h-4 w-4 mr-2 text-red-600" />
                                      رد کردن
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              )}
                              
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>عملیات</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem asChild>
                                    <Link href={route("admin.comments.show", comment.id)}>
                                      <Eye className="h-4 w-4 mr-2" />
                                      مشاهده جزئیات
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleEdit(comment)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    ویرایش
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    onClick={() => handleDelete(comment.id)}
                                    className="text-destructive focus:text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    حذف
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pagination */}
            {comments.last_page > 1 && (
              <div className="flex items-center justify-center gap-2">
                {Array.from({ length: comments.last_page }, (_, i) => (
                  <Button
                    key={i + 1}
                    variant={comments.current_page === i + 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      const params: Record<string, string | number> = { page: i + 1 };
                      if (searchTerm) params.search = searchTerm;
                      if (activeTab !== "all") {
                        if (activeTab === "new") {
                          params.seen = "0";
                        } else {
                          params.status = activeTab;
                        }
                      }
                      router.get(route("admin.comments.index"), params);
                    }}
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <form onSubmit={handleUpdate}>
            <DialogHeader>
              <DialogTitle>ویرایش کامنت</DialogTitle>
              <DialogDescription>
                تغییرات کامنت را اعمال کنید.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="body">متن کامنت</Label>
                <Textarea
                  id="body"
                  value={data.body}
                  onChange={(e) => setData("body", e.target.value)}
                  className="min-h-[120px]"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="approved">وضعیت تایید</Label>
                  <Select value={data.approved.toString()} onValueChange={(value) => setData("approved", parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">در انتظار</SelectItem>
                      <SelectItem value="1">تایید شده</SelectItem>
                      <SelectItem value="2">رد شده</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">وضعیت فعال</Label>
                  <div className="flex items-center space-x-2 space-x-reverse pt-2">
                    <Switch
                      id="status"
                      checked={data.status}
                      onCheckedChange={(checked) => setData("status", checked)}
                    />
                    <Label htmlFor="status" className="font-medium">فعال</Label>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                انصراف
              </Button>
              <Button type="submit" disabled={processing}>
                {processing ? "در حال ذخیره..." : "ذخیره تغییرات"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}