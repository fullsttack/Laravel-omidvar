import { Head, Link, useForm, router } from "@inertiajs/react";
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Comment, PageProps } from "@/types";
import {
  CheckCircle,
  Eye,
  MessageCircle,
  Search,
  Trash2,
  User,
  XCircle,
  MoreHorizontal,
  Edit,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface Props extends PageProps {
  comments: {
    data: Array<Comment & {
      author: {
        id: number;
        name: string;
        email: string;
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

  const { data, setData, patch, processing, reset } = useForm({
    body: "",
    approved: false,
    status: true,
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedComments(comments.data.map(c => c.id));
    } else {
      setSelectedComments([]);
    }
  };

  const handleSelectComment = (commentId: number, checked: boolean) => {
    if (checked) {
      setSelectedComments(prev => [...prev, commentId]);
    } else {
      setSelectedComments(prev => prev.filter(id => id !== commentId));
    }
  };

  const applyFilters = (status = activeTab, search = searchTerm) => {
    const params: any = {};
    
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
      approved: Boolean(comment.approved),
      status: Boolean(comment.status),
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingComment) return;

    patch(route("admin.comments.update", editingComment.id), {
      onSuccess: () => {
        toast.success("کامنت با موفقیت بروزرسانی شد");
        setIsEditDialogOpen(false);
        reset();
        setEditingComment(null);
      },
      onError: () => {
        toast.error("خطا در بروزرسانی کامنت");
      },
    });
  };

  const handleDelete = (commentId: number) => {
    if (!confirm("آیا مطمئن هستید که می‌خواهید این کامنت را حذف کنید؟")) {
      return;
    }

    router.delete(route("admin.comments.destroy", commentId), {
      onSuccess: () => {
        toast.success("کامنت با موفقیت حذف شد");
        setSelectedComments(prev => prev.filter(id => id !== commentId));
      },
      onError: () => {
        toast.error("خطا در حذف کامنت");
      },
    });
  };

  const handleBulkAction = (action: string) => {
    if (selectedComments.length === 0) {
      toast.error("لطفا حداقل یک کامنت را انتخاب کنید");
      return;
    }

    router.post(route("admin.comments.bulk-update"), {
      ids: selectedComments,
      action: action,
    }, {
      onSuccess: () => {
        toast.success("عملیات با موفقیت انجام شد");
        setSelectedComments([]);
      },
      onError: () => {
        toast.error("خطا در انجام عملیات");
      },
    });
  };

  const toggleApproval = (comment: Comment) => {
    router.patch(route("admin.comments.update", comment.id), {
      approved: !comment.approved,
    }, {
      preserveScroll: true,
      onSuccess: () => {
        toast.success(comment.approved ? "تایید کامنت لغو شد" : "کامنت تایید شد");
      },
    });
  };

  const getStatusBadge = (comment: Comment) => {
    if (comment.approved) {
      return <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
        <CheckCircle className="h-3 w-3 mr-1" />
        تایید شده
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

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">مدیریت کامنت‌ها</h1>
            <p className="text-muted-foreground">مدیریت و بررسی کامنت‌های کاربران</p>
          </div>
          
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
          <TabsList className="grid w-full grid-cols-4">
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
                        <XCircle className="h-4 w-4 mr-1" />
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
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>لیست کامنت‌ها</CardTitle>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedComments.length === comments.data.length && comments.data.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                    <Label className="text-sm">انتخاب همه</Label>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {comments.data.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">کامنتی موجود نیست</h3>
                    <p className="text-muted-foreground">هیچ کامنتی با این فیلتر یافت نشد.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">انتخاب</TableHead>
                        <TableHead>کاربر</TableHead>
                        <TableHead>متن کامنت</TableHead>
                        <TableHead>وضعیت</TableHead>
                        <TableHead>تاریخ</TableHead>
                        <TableHead className="w-32">عملیات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {comments.data.map((comment) => (
                        <TableRow key={comment.id} className="group hover:bg-muted/50">
                          <TableCell>
                            <Checkbox
                              checked={selectedComments.includes(comment.id)}
                              onCheckedChange={(checked) => handleSelectComment(comment.id, checked as boolean)}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="flex flex-col">
                                <span className="font-medium">{comment.author.name}</span>
                                <span className="text-xs text-muted-foreground">{comment.author.email}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-md">
                              <p className="text-sm line-clamp-2 leading-relaxed">
                                {comment.body}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className="text-xs">
                                  {comment.commentable_type}#{comment.commentable_id}
                                </Badge>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              {getStatusBadge(comment)}
                              {getSeenBadge(comment)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <time className="text-sm text-muted-foreground">
                              {formatDate(comment.created_at)}
                            </time>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleApproval(comment)}
                                title={comment.approved ? "لغو تایید" : "تایید"}
                              >
                                {comment.approved ? (
                                  <XCircle className="h-4 w-4 text-red-600" />
                                ) : (
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                )}
                              </Button>
                              
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
                      const params: any = { page: i + 1 };
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
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Switch
                    id="approved"
                    checked={data.approved}
                    onCheckedChange={(checked) => setData("approved", checked)}
                  />
                  <Label htmlFor="approved" className="font-medium">تایید شده</Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Switch
                    id="status"
                    checked={data.status}
                    onCheckedChange={(checked) => setData("status", checked)}
                  />
                  <Label htmlFor="status" className="font-medium">فعال</Label>
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