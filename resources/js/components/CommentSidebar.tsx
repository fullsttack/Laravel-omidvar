import { useState } from "react";
import { useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MessageCircle,
  Send,
  User,
  Calendar,
  Reply,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "sonner";
import { Comment } from "@/types";

interface CommentSidebarProps {
  commentable_type: string;
  commentable_id: number;
  comments?: Comment[];
  className?: string;
}

export default function CommentSidebar({
  commentable_type,
  commentable_id,
  comments = [],
  className = "",
}: CommentSidebarProps) {
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set());

  const { data, setData, post, processing, reset, errors } = useForm({
    body: "",
    commentable_type,
    commentable_id,
    parent_id: null as number | null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    post(route("panel.comments.store"), {
      onSuccess: () => {
        toast.success("کامنت شما با موفقیت ثبت شد و پس از بررسی نمایش داده خواهد شد");
        reset();
        setShowCommentForm(false);
        setReplyTo(null);
      },
      onError: () => {
        toast.error("خطا در ثبت کامنت");
      },
    });
  };

  const handleReply = (commentId: number) => {
    setReplyTo(commentId);
    setData("parent_id", commentId);
    setShowCommentForm(true);
  };

  const toggleExpanded = (commentId: number) => {
    const newExpanded = new Set(expandedComments);
    if (newExpanded.has(commentId)) {
      newExpanded.delete(commentId);
    } else {
      newExpanded.add(commentId);
    }
    setExpandedComments(newExpanded);
  };

  const approvedComments = comments.filter(comment => comment.approved);
  const parentComments = approvedComments.filter(comment => !comment.parent_id);

  const getCommentReplies = (parentId: number) => {
    return approvedComments.filter(comment => comment.parent_id === parentId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className={`bg-background border rounded-lg ${className}`}>
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">نظرات</h3>
            <Badge variant="secondary">{approvedComments.length}</Badge>
          </div>
          <Button
            size="sm"
            onClick={() => setShowCommentForm(!showCommentForm)}
            variant={showCommentForm ? "outline" : "default"}
          >
            {showCommentForm ? "انصراف" : "ثبت نظر"}
          </Button>
        </div>
      </div>

      {/* Comment Form */}
      {showCommentForm && (
        <div className="p-4 border-b bg-muted/20">
          <form onSubmit={handleSubmit} className="space-y-3">
            {replyTo && (
              <div className="text-xs text-muted-foreground bg-background p-2 rounded border-r-2 border-primary">
                در پاسخ به کامنت #{replyTo}
              </div>
            )}
            <Textarea
              placeholder="نظر خود را بنویسید..."
              value={data.body}
              onChange={(e) => setData("body", e.target.value)}
              className="min-h-[80px] resize-none"
              maxLength={2000}
            />
            {errors.body && (
              <p className="text-xs text-destructive">{errors.body}</p>
            )}
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {data.body.length}/2000
              </span>
              <div className="flex gap-2">
                {replyTo && (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setReplyTo(null);
                      setData("parent_id", null);
                    }}
                  >
                    لغو پاسخ
                  </Button>
                )}
                <Button type="submit" size="sm" disabled={processing}>
                  <Send className="h-4 w-4 mr-1" />
                  {processing ? "ارسال..." : "ارسال"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Comments List */}
      <div className="p-4 max-h-96 overflow-y-auto">
        {parentComments.length === 0 ? (
          <div className="text-center py-6">
            <MessageCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">هنوز نظری ثبت نشده</p>
            <p className="text-xs text-muted-foreground mt-1">
              اولین نفری باشید که نظر می‌دهید
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {parentComments.map((comment) => {
              const replies = getCommentReplies(comment.id);
              const isExpanded = expandedComments.has(comment.id);
              
              return (
                <div key={comment.id} className="space-y-3">
                  {/* Main Comment */}
                  <div className="bg-muted/10 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <User className="h-3 w-3" />
                        {comment.author?.name || "کاربر"}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatDate(comment.created_at)}
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed mb-3">{comment.body}</p>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-xs h-6 px-2"
                        onClick={() => handleReply(comment.id)}
                      >
                        <Reply className="h-3 w-3 mr-1" />
                        پاسخ
                      </Button>
                      {replies.length > 0 && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-xs h-6 px-2"
                          onClick={() => toggleExpanded(comment.id)}
                        >
                          {isExpanded ? (
                            <ChevronUp className="h-3 w-3 mr-1" />
                          ) : (
                            <ChevronDown className="h-3 w-3 mr-1" />
                          )}
                          {replies.length} پاسخ
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Replies */}
                  {replies.length > 0 && isExpanded && (
                    <div className="mr-4 space-y-2 border-r-2 border-muted pr-3">
                      {replies.map((reply) => (
                        <div key={reply.id} className="bg-background rounded-lg p-3 border">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <User className="h-3 w-3" />
                              {reply.author?.name || "کاربر"}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {formatDate(reply.created_at)}
                            </div>
                          </div>
                          <p className="text-sm leading-relaxed">{reply.body}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t bg-muted/10">
        <p className="text-xs text-muted-foreground text-center">
          نظرات پس از بررسی منتشر می‌شوند
        </p>
      </div>
    </div>
  );
}