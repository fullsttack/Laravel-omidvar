import { Head, Link } from "@inertiajs/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import PanelLayout from "@/layouts/PanelLayout";
import { Comment, PageProps } from "@/types";
import { ArrowLeft, MessageCircle, User, Calendar, Reply } from "lucide-react";

interface Props extends PageProps {
  comment: Comment & {
    author: {
      id: number;
      name: string;
      email: string;
    };
    replies?: Array<Comment & {
      author: {
        id: number;
        name: string;
        email: string;
      };
    }>;
    commentable?: any;
  };
}

export default function Show({ comment }: Props) {
  const getStatusBadge = (commentItem: Comment) => {
    if (commentItem.approved) {
      return <Badge variant="success">تایید شده</Badge>;
    }
    return <Badge variant="destructive">در انتظار تایید</Badge>;
  };

  return (
    <PanelLayout>
      <Head title="جزئیات کامنت" />

      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Link href={route("panel.comments.index")}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4" />
              بازگشت
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">جزئیات کامنت</h1>
        </div>

        <div className="space-y-6">
          {/* Main Comment */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">کامنت اصلی</CardTitle>
                {getStatusBadge(comment)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {comment.author.name}
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
                            {reply.author.name}
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
                        {getStatusBadge(reply)}
                      </div>
                      <div className="bg-muted/30 p-3 rounded-md border-r-4 border-primary">
                        <p className="text-sm leading-relaxed">{reply.body}</p>
                      </div>
                      {index < comment.replies.length - 1 && <Separator className="my-4" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Comment Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">اطلاعات کامنت</CardTitle>
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
                  <div className="text-2xl font-bold text-primary">
                    {comment.approved ? '✓' : '✗'}
                  </div>
                  <div className="text-sm text-muted-foreground">تایید</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {comment.seen ? '✓' : '✗'}
                  </div>
                  <div className="text-sm text-muted-foreground">مشاهده</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {comment.status ? '✓' : '✗'}
                  </div>
                  <div className="text-sm text-muted-foreground">فعال</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PanelLayout>
  );
}