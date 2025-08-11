import { Head, Link, useForm, usePage } from "@inertiajs/react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Comment, PageProps } from "@/types";
import { router } from "@inertiajs/react";
import {
  CheckCircle,
  Eye,
  Filter,
  MessageCircle,
  Search,
  Trash2,
  User,
  XCircle,
  MoreHorizontal,
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
      commentable?: any;
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
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const [statusFilter, setStatusFilter] = useState(filters.status || "all");
  const [seenFilter, setSeenFilter] = useState(filters.seen || "all");

  const { data, setData, patch, processing, reset } = useForm({
    body: "",
    approved: false,
    status: true,
  });

  useEffect(() => {
    setShowBulkActions(selectedComments.length > 0);
  }, [selectedComments]);

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

  const applyFilters = () => {
    const params: any = {};
    
    if (searchTerm) params.search = searchTerm;
    if (statusFilter !== "all") params.status = statusFilter;
    if (seenFilter !== "all") params.seen = seenFilter;

    router.get(route("admin.comments.index"), params, {
      preserveState: true,
      replace: true,
    });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setSeenFilter("all");
    router.get(route("admin.comments.index"));
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
    if (selectedComments.length === 0) return;

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

  const getStatusBadge = (comment: Comment) => {
    if (comment.approved) {
      return <Badge variant="success">تایید شده</Badge>;
    }
    return <Badge variant="destructive">در انتظار تایید</Badge>;
  };

  const getSeenBadge = (comment: Comment) => {
    if (comment.seen) {
      return <Badge variant="secondary">مشاهده شده</Badge>;
    }
    return <Badge variant="outline">جدید</Badge>;
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="مدیریت کامنت‌ها" />

      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">مدیریت کامنت‌ها</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">کل کامنت‌ها</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <MessageCircle className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">تایید شده</p>
                  <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">در انتظار</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.unapproved}</p>
                </div>
                <XCircle className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">جدید</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.unseen}</p>
                </div>
                <Eye className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="flex gap-2">
                  <Input
                    placeholder="جستجو در کامنت‌ها..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={applyFilters}>
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="وضعیت" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">همه</SelectItem>
                    <SelectItem value="approved">تایید شده</SelectItem>
                    <SelectItem value="unapproved">در انتظار</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={seenFilter} onValueChange={setSeenFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="مشاهده" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">همه</SelectItem>
                    <SelectItem value="1">مشاهده شده</SelectItem>
                    <SelectItem value="0">جدید</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={clearFilters}>
                  <Filter className="h-4 w-4" />
                  پاک کردن
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        {showBulkActions && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm">{selectedComments.length} کامنت انتخاب شده</p>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleBulkAction("approve")}>
                    تایید همه
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction("disapprove")}>
                    رد همه
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction("mark_seen")}>
                    علامت‌گذاری به عنوان خوانده شده
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleBulkAction("delete")}>
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
                  checked={selectedComments.length === comments.data.length}
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-sm">انتخاب همه</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {comments.data.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">کامنتی موجود نیست</h3>
                <p className="text-muted-foreground">هیچ کامنتی با این فیلتر یافت نشد.</p>
              </div>
            ) : (
              <div className="space-y-0">
                {comments.data.map((comment, index) => (
                  <div key={comment.id} className={index !== comments.data.length - 1 ? "border-b" : ""}>
                    <div className="p-4">
                      <div className="flex items-start gap-4">
                        <Checkbox
                          checked={selectedComments.includes(comment.id)}
                          onCheckedChange={(checked) => handleSelectComment(comment.id, checked as boolean)}
                        />
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <User className="h-4 w-4" />
                                {comment.author.name}
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {new Date(comment.created_at).toLocaleDateString('fa-IR')}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {getStatusBadge(comment)}
                              {getSeenBadge(comment)}
                            </div>
                          </div>
                          <p className="text-sm leading-relaxed">{comment.body}</p>
                          {comment.commentable && (
                            <p className="text-xs text-muted-foreground">
                              کامنت برای: {comment.commentable_type}#{comment.commentable_id}
                            </p>
                          )}
                          <div className="flex items-center gap-2">
                            <Link href={route("admin.comments.show", comment.id)}>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4" />
                                مشاهده
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(comment)}
                            >
                              ویرایش
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(comment.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {comments.last_page > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            {Array.from({ length: comments.last_page }, (_, i) => (
              <Link
                key={i + 1}
                href={route("admin.comments.index", { ...filters, page: i + 1 })}
                className={`px-3 py-1 rounded ${
                  comments.current_page === i + 1
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                {i + 1}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-lg">
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
                  className="min-h-[100px]"
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="approved"
                  checked={data.approved}
                  onCheckedChange={(checked) => setData("approved", checked)}
                />
                <Label htmlFor="approved">تایید شده</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="status"
                  checked={data.status}
                  onCheckedChange={(checked) => setData("status", checked)}
                />
                <Label htmlFor="status">فعال</Label>
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