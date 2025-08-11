import { Head, Link, useForm } from "@inertiajs/react";
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Comment } from "@/types";
import { router } from "@inertiajs/react";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Edit,
  Eye,
  MessageCircle,
  Reply,
  Trash2,
  User,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  comment: Comment & {
    author: {
      id: number;
      name: string;
      email: string;
      mobile: string;
    };
    replies?: Array<Comment & {
      author: {
        id: number;
        name: string;
        email: string;
        mobile: string;
      };
    }>;
    parent?: Comment & {
      author: {
        id: number;
        name: string;
        email: string;
        mobile: string;
      };
    };
    commentable?: Record<string, unknown>;
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
  {
    title: 'جزئیات کامنت',
    href: '#',
  },
];

export default function Show({ comment }: Props) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const { data, setData, patch, processing } = useForm({
    body: comment.body,
    approved: Boolean(comment.approved),
    status: Boolean(comment.status),
  });

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();

    patch(route("admin.comments.update", comment.id), {
      onSuccess: () => {
        toast.success("کامنت با موفقیت بروزرسانی شد");
        setIsEditDialogOpen(false);
      },
      onError: () => {
        toast.error("خطا در بروزرسانی کامنت");
      },
    });
  };

  const handleDelete = () => {
    if (!confirm("آیا مطمئن هستید که می‌خواهید این کامنت را حذف کنید؟")) {
      return;
    }

    router.delete(route("admin.comments.destroy", comment.id), {
      onSuccess: () => {
        toast.success("کامنت با موفقیت حذف شد");
        router.visit(route("admin.comments.index"));
      },
      onError: () => {
        toast.error("خطا در حذف کامنت");
      },
    });
  };

  const toggleApproval = () => {
    router.patch(route("admin.comments.update", comment.id), {
      approved: !comment.approved,
    }, {
      preserveScroll: true,
      onSuccess: () => {
        toast.success(comment.approved ? "تایید کامنت لغو شد" : "کامنت تایید شد");
      },
    });
  };

  const markAsSeen = () => {
    if (comment.seen) return;
    
    router.patch(route("admin.comments.update", comment.id), {
      seen: true,
    }, {
      preserveScroll: true,
      onSuccess: () => {
        toast.success("کامنت به عنوان مشاهده شده علامت‌گذاری شد");
      },
    });
  };

  const getStatusBadge = (commentItem: Comment) => {
    if (commentItem.approved) {
      return <Badge variant="default" className="gap-1 bg-green-100 text-green-800 hover:bg-green-100">
        <CheckCircle className="h-3 w-3" />
        تایید شده
      </Badge>;
    }
    return <Badge variant="destructive" className="gap-1">
      <XCircle className="h-3 w-3" />
      در انتظار تایید
    </Badge>;
  };

  const getSeenBadge = (commentItem: Comment) => {
    if (commentItem.seen) {
      return <Badge variant="secondary">مشاهده شده</Badge>;
    }
    return <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">جدید</Badge>;
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="جزئیات کامنت" />

      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href={route("admin.comments.index")}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4" />
                بازگشت
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">جزئیات کامنت</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(true)}
            >
              <Edit className="h-4 w-4 mr-2" />
              ویرایش
            </Button>
            <Button
              variant={comment.approved ? "outline" : "default"}
              onClick={toggleApproval}
            >
              {comment.approved ? "لغو تایید" : "تایید کامنت"}
            </Button>
            {!comment.seen && (
              <Button variant="outline" onClick={markAsSeen}>
                <Eye className="h-4 w-4 mr-2" />
                علامت‌گذاری به عنوان مشاهده شده
              </Button>
            )}
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              حذف
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Parent Comment (if this is a reply) */}
          {comment.parent && (
            <Card className="border-yellow-200">
              <CardHeader className="bg-yellow-50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Reply className="h-5 w-5" />
                  کامنت والد
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {comment.parent.author.mobile} ({comment.parent.author.name})
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(comment.parent.created_at).toLocaleDateString('fa-IR')}
                  </div>
                </div>
                <p className="text-sm leading-relaxed bg-muted/30 p-3 rounded-md">
                  {comment.parent.body}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Main Comment */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  کامنت {comment.parent ? "پاسخ" : "اصلی"}
                </CardTitle>
                <div className="flex items-center gap-2">
                  {getStatusBadge(comment)}
                  {getSeenBadge(comment)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {comment.author.mobile} ({comment.author.name})
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(comment.created_at).toLocaleDateString('fa-IR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
                <Separator />
                <p className="text-base leading-relaxed">{comment.body}</p>
                
                {comment.commentable && (
                  <>
                    <Separator />
                    <div className="bg-muted/50 p-3 rounded-md">
                      <p className="text-sm font-medium mb-1">مربوط به:</p>
                      <p className="text-sm text-muted-foreground">
                        {comment.commentable_type}#{comment.commentable_id}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Reply className="h-5 w-5" />
                  پاسخ‌ها ({comment.replies.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {comment.replies.map((reply, index) => (
                    <div key={reply.id}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {reply.author?.mobile} ({reply.author?.name})
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(reply.created_at).toLocaleDateString('fa-IR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(reply)}
                          <Link href={route("admin.comments.show", reply.id)}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                      <div className="bg-muted/30 p-3 rounded-md border-r-4 border-primary">
                        <p className="text-sm leading-relaxed">{reply.body}</p>
                      </div>
                      {index < (comment.replies?.length || 0) - 1 && <Separator className="my-4" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Comment Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">آمار کامنت</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {comment.replies ? comment.replies.length : 0}
                  </div>
                  <div className="text-sm text-muted-foreground">پاسخ</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${comment.approved ? 'text-green-600' : 'text-red-600'}`}>
                    {comment.approved ? '✓' : '✗'}
                  </div>
                  <div className="text-sm text-muted-foreground">تایید</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${comment.seen ? 'text-blue-600' : 'text-yellow-600'}`}>
                    {comment.seen ? '✓' : '✗'}
                  </div>
                  <div className="text-sm text-muted-foreground">مشاهده</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${comment.status ? 'text-green-600' : 'text-red-600'}`}>
                    {comment.status ? '✓' : '✗'}
                  </div>
                  <div className="text-sm text-muted-foreground">فعال</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
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
              <div className="flex items-center space-x-2 space-x-reverse">
                <Switch
                  id="approved"
                  checked={data.approved}
                  onCheckedChange={(checked) => setData("approved", checked)}
                />
                <Label htmlFor="approved">تایید شده</Label>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
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