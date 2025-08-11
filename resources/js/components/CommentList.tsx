import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  MessageCircle,
  User,
  Calendar,
  Reply,
  ChevronDown,
  ChevronUp,
  Heart,
  Flag,
} from "lucide-react";
import { Comment } from "@/types";
import CommentForm from "./CommentForm";

interface CommentListProps {
  comments: Comment[];
  commentable_type: string;
  commentable_id: number;
  showReplyForm?: boolean;
  allowReply?: boolean;
  maxHeight?: string;
  className?: string;
}

export default function CommentList({
  comments,
  commentable_type,
  commentable_id,
  showReplyForm = false,
  allowReply = true,
  maxHeight = "max-h-96",
  className = "",
}: CommentListProps) {
  const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set());
  const [replyingTo, setReplyingTo] = useState<number | null>(null);

  // Filter only approved comments
  const approvedComments = comments.filter(comment => comment.approved && comment.status);
  const parentComments = approvedComments.filter(comment => !comment.parent_id);

  const getCommentReplies = (parentId: number) => {
    return approvedComments.filter(comment => comment.parent_id === parentId);
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

  const handleReply = (commentId: number) => {
    setReplyingTo(replyingTo === commentId ? null : commentId);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return "امروز";
    } else if (diffDays === 2) {
      return "دیروز";
    } else if (diffDays <= 7) {
      return `${diffDays} روز پیش`;
    } else {
      return date.toLocaleDateString('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  if (approvedComments.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="py-12">
          <div className="text-center">
            <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">هنوز نظری ثبت نشده</h3>
            <p className="text-muted-foreground mb-6">
              اولین نفری باشید که نظر می‌دهید
            </p>
            {showReplyForm && (
              <CommentForm
                commentable_type={commentable_type}
                commentable_id={commentable_id}
                title="ثبت اولین نظر"
                className="max-w-md mx-auto"
              />
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          نظرات
          <Badge variant="secondary">{approvedComments.length}</Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className={`space-y-6 overflow-y-auto ${maxHeight}`}>
          {parentComments.map((comment) => {
            const replies = getCommentReplies(comment.id);
            const isExpanded = expandedComments.has(comment.id);
            const isReplying = replyingTo === comment.id;
            
            return (
              <div key={comment.id} className="space-y-4">
                {/* Main Comment */}
                <div className="flex space-x-4 space-x-reverse">
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarFallback className="text-sm">
                      {comment.author?.name ? getInitials(comment.author.name) : 'کاربر'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-3">
                    <div className="bg-muted/20 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-sm">
                            {comment.author?.name || 'کاربر'}
                          </span>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {formatDate(comment.created_at)}
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-sm leading-relaxed mb-3">
                        {comment.body}
                      </p>
                      
                      <div className="flex items-center gap-4">
                        {allowReply && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-xs h-7 px-2"
                            onClick={() => handleReply(comment.id)}
                          >
                            <Reply className="h-3 w-3 mr-1" />
                            پاسخ
                          </Button>
                        )}
                        
                        {replies.length > 0 && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-xs h-7 px-2"
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

                    {/* Reply Form */}
                    {isReplying && allowReply && (
                      <div className="mr-4">
                        <CommentForm
                          commentable_type={commentable_type}
                          commentable_id={commentable_id}
                          parent_id={comment.id}
                          title="پاسخ شما"
                          placeholder="پاسخ خود را بنویسید..."
                          onSuccess={() => setReplyingTo(null)}
                          onCancel={() => setReplyingTo(null)}
                          className="shadow-sm"
                        />
                      </div>
                    )}

                    {/* Replies */}
                    {replies.length > 0 && isExpanded && (
                      <div className="mr-6 space-y-4 border-r-2 border-muted pr-4">
                        {replies.map((reply, index) => (
                          <div key={reply.id}>
                            <div className="flex space-x-3 space-x-reverse">
                              <Avatar className="h-8 w-8 flex-shrink-0">
                                <AvatarFallback className="text-xs">
                                  {reply.author?.name ? getInitials(reply.author.name) : 'کاربر'}
                                </AvatarFallback>
                              </Avatar>
                              
                              <div className="flex-1">
                                <div className="bg-background border rounded-lg p-3">
                                  <div className="flex items-center gap-3 mb-2">
                                    <span className="font-medium text-sm">
                                      {reply.author?.name || 'کاربر'}
                                    </span>
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                      <Calendar className="h-3 w-3" />
                                      {formatDate(reply.created_at)}
                                    </div>
                                  </div>
                                  <p className="text-sm leading-relaxed">
                                    {reply.body}
                                  </p>
                                </div>
                              </div>
                            </div>
                            
                            {index < replies.length - 1 && (
                              <Separator className="my-3" />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Separator between main comments */}
                <Separator />
              </div>
            );
          })}
        </div>

        {/* Add Comment Form */}
        {showReplyForm && !replyingTo && (
          <div className="mt-6">
            <Separator className="mb-6" />
            <CommentForm
              commentable_type={commentable_type}
              commentable_id={commentable_id}
              title="ثبت نظر جدید"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}