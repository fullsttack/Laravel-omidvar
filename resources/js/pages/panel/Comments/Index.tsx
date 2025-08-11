import { Head, Link, useForm, usePage } from "@inertiajs/react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import PanelLayout from "@/layouts/PanelLayout";
import { Comment, PageProps } from "@/types";
import { router } from "@inertiajs/react";
import { Pencil, Trash2, Eye, MessageCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Props extends PageProps {
  comments: {
    data: Comment[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export default function Index({ comments }: Props) {
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { data, setData, patch, processing, reset } = useForm({
    body: "",
  });

  const handleEdit = (comment: Comment) => {
    setEditingComment(comment);
    setData("body", comment.body);
    setIsEditDialogOpen(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingComment) return;

    patch(route("panel.comments.update", editingComment.id), {
      onSuccess: () => {
        toast.success("کامنت با موفقیت ویرایش شد");
        setIsEditDialogOpen(false);
        reset();
        setEditingComment(null);
      },
      onError: () => {
        toast.error("خطا در ویرایش کامنت");
      },
    });
  };

  const handleDelete = (commentId: number) => {
    if (!confirm("آیا مطمئن هستید که می‌خواهید این کامنت را حذف کنید؟")) {
      return;
    }

    router.delete(route("panel.comments.destroy", commentId), {
      onSuccess: () => {
        toast.success("کامنت با موفقیت حذف شد");
      },
      onError: () => {
        toast.error("خطا در حذف کامنت");
      },
    });
  };

  const getStatusBadge = (comment: Comment) => {
    if (comment.approved) {
      return <Badge variant="success">تایید شده</Badge>;
    }
    return <Badge variant="destructive">در انتظار تایید</Badge>;
  };

  return (
    <PanelLayout>
      <Head title="کامنت‌های من" />

      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">کامنت‌های من</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MessageCircle className="h-4 w-4" />
            {comments.total} کامنت
          </div>
        </div>

        {comments.data.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">کامنتی موجود نیست</h3>
                <p className="text-muted-foreground">شما هنوز کامنتی ثبت نکرده‌اید.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {comments.data.map((comment) => (
              <Card key={comment.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusBadge(comment)}
                      <span className="text-sm text-muted-foreground">
                        {new Date(comment.created_at).toLocaleDateString('fa-IR')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={route("panel.comments.show", comment.id)}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(comment)}
                      >
                        <Pencil className="h-4 w-4" />
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
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">{comment.body}</p>
                  {comment.commentable && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-xs text-muted-foreground">
                        کامنت برای: {comment.commentable_type}#{comment.commentable_id}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {comments.last_page > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            {Array.from({ length: comments.last_page }, (_, i) => (
              <Link
                key={i + 1}
                href={route("panel.comments.index", { page: i + 1 })}
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

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <form onSubmit={handleUpdate}>
            <DialogHeader>
              <DialogTitle>ویرایش کامنت</DialogTitle>
              <DialogDescription>
                متن کامنت خود را ویرایش کنید. پس از ویرایش، کامنت باید مجدداً تایید شود.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="body">متن کامنت</Label>
                <Textarea
                  id="body"
                  value={data.body}
                  onChange={(e) => setData("body", e.target.value)}
                  placeholder="متن کامنت خود را وارد کنید..."
                  className="min-h-[100px]"
                  required
                />
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
    </PanelLayout>
  );
}