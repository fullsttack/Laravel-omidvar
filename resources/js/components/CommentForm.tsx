import { useState } from "react";
import { useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MessageCircle, Send, AlertCircle, X } from "lucide-react";
import { toast } from "sonner";

interface CommentFormProps {
  commentable_type: string;
  commentable_id: number;
  parent_id?: number | null;
  onSuccess?: () => void;
  onCancel?: () => void;
  placeholder?: string;
  title?: string;
  className?: string;
}

export default function CommentForm({
  commentable_type,
  commentable_id,
  parent_id = null,
  onSuccess,
  onCancel,
  placeholder = "نظر خود را بنویسید...",
  title = "ثبت نظر",
  className = "",
}: CommentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, setData, post, processing, reset, errors } = useForm({
    body: "",
    commentable_type,
    commentable_id,
    parent_id,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!data.body.trim()) {
      toast.error("لطفا متن نظر را وارد کنید");
      return;
    }

    setIsSubmitting(true);
    
    post(route("panel.comments.store"), {
      onSuccess: () => {
        toast.success("نظر شما با موفقیت ثبت شد و پس از بررسی نمایش داده خواهد شد");
        reset();
        setIsSubmitting(false);
        onSuccess?.();
      },
      onError: (errors) => {
        setIsSubmitting(false);
        if (errors.body) {
          toast.error(errors.body);
        } else {
          toast.error("خطا در ثبت نظر. لطفا دوباره تلاش کنید");
        }
      },
      onFinish: () => {
        setIsSubmitting(false);
      }
    });
  };

  const handleCancel = () => {
    reset();
    onCancel?.();
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            {title}
          </CardTitle>
          {onCancel && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        {parent_id && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              شما در حال پاسخ به یک نظر هستید. نظر شما به عنوان پاسخ ثبت خواهد شد.
            </AlertDescription>
          </Alert>
        )}
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="comment-body">متن نظر</Label>
            <Textarea
              id="comment-body"
              placeholder={placeholder}
              value={data.body}
              onChange={(e) => setData("body", e.target.value)}
              className="min-h-[120px] resize-none"
              maxLength={2000}
              disabled={processing || isSubmitting}
            />
            {errors.body && (
              <p className="text-sm text-destructive">{errors.body}</p>
            )}
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>
                حداکثر 2000 کاراکتر
              </span>
              <span className={data.body.length > 1800 ? "text-warning" : ""}>
                {data.body.length}/2000
              </span>
            </div>
          </div>

          <Alert className="border-blue-200 bg-blue-50">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              نظرات پس از بررسی توسط مدیران سایت منتشر می‌شوند. لطفا از ادب و احترام در نوشتن نظر خود استفاده کنید.
            </AlertDescription>
          </Alert>

          <div className="flex justify-end gap-3">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={processing || isSubmitting}
              >
                انصراف
              </Button>
            )}
            <Button 
              type="submit" 
              disabled={processing || isSubmitting || !data.body.trim()}
              className="min-w-[100px]"
            >
              {processing || isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  در حال ارسال...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  ارسال نظر
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}