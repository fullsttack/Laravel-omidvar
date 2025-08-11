import { Head, Link, useForm, router } from "@inertiajs/react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
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
  Edit,
  MoreHorizontal,
  Reply,
  User,
  Calendar,
  Tag,
  Flag,
  File,
  Download,
  AlertCircle,
  Clock,
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

interface TicketFile {
  id: number;
  file_path: string;
  file_size: number;
  file_type: string;
  status: boolean;
  created_at: string;
}

interface TicketReply {
  id: number;
  subject: string | null;
  description: string;
  status: number;
  seen: boolean;
  created_at: string;
  updated_at: string;
  user: TicketUser;
  files: TicketFile[];
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
  files: TicketFile[];
  replies: TicketReply[];
  parent?: TicketData;
}

interface Props {
  ticket: TicketData;
}

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

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default function Show({ ticket }: Props) {
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'داشبورد ادمین',
      href: '/admin',
    },
    {
      title: 'تیکت‌ها',
      href: '/admin/tickets',
    },
    {
      title: ticket.subject || `تیکت #${ticket.id}`,
      href: `/admin/tickets/${ticket.id}`,
    },
  ];

  const { data: replyData, setData: setReplyData, post: postReply, processing: replyProcessing, errors: replyErrors, reset: resetReply } = useForm({
    subject: '',
    description: '',
    status: 2,
  });

  const { data: editData, setData: setEditData, patch: patchTicket, processing: editProcessing, errors: editErrors, reset: resetEdit } = useForm({
    subject: ticket.subject || '',
    description: ticket.description,
    status: ticket.status,
  });

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault();
    postReply(`/admin/tickets`, {
      ticket_id: ticket.id,
      ...replyData,
    }, {
      onSuccess: () => {
        toast.success('پاسخ با موفقیت ارسال شد');
        setIsReplyDialogOpen(false);
        resetReply();
      },
      onError: () => {
        toast.error('خطا در ارسال پاسخ');
      },
    });
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    patchTicket(`/admin/tickets/${ticket.id}`, {
      onSuccess: () => {
        toast.success('تیکت با موفقیت ویرایش شد');
        setIsEditDialogOpen(false);
      },
      onError: () => {
        toast.error('خطا در ویرایش تیکت');
      },
    });
  };

  const handleStatusChange = (status: number) => {
    router.patch(`/admin/tickets/${ticket.id}`, { status }, {
      preserveScroll: true,
      onSuccess: () => {
        toast.success('وضعیت تیکت با موفقیت به‌روزرسانی شد');
      },
      onError: () => {
        toast.error('خطا در به‌روزرسانی وضعیت');
      },
    });
  };

  const handleDelete = () => {
    if (confirm('آیا از حذف این تیکت اطمینان دارید؟')) {
      router.delete(`/admin/tickets/${ticket.id}`, {
        onSuccess: () => {
          toast.success('تیکت با موفقیت حذف شد');
          router.visit('/admin/tickets');
        },
        onError: () => {
          toast.error('خطا در حذف تیکت');
        },
      });
    }
  };

  const downloadFile = (file: TicketFile) => {
    window.open(`/storage/${file.file_path}`, '_blank');
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`تیکت: ${ticket.subject || `#${ticket.id}`}`} />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{ticket.subject || `تیکت #${ticket.id}`}</h1>
            <div className="flex items-center gap-2 mt-2">
              {getStatusBadge(ticket.status)}
              {!ticket.seen && <Badge variant="outline">خوانده‌نشده</Badge>}
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setIsReplyDialogOpen(true)}>
              <Reply className="h-4 w-4 mr-2" />
              پاسخ
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>عملیات</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  ویرایش
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange(0)}>
                  <AlertCircle className="mr-2 h-4 w-4" />
                  باز کردن
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange(2)}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  پاسخ داده شده
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange(1)}>
                  <X className="mr-2 h-4 w-4" />
                  بستن
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600" onClick={handleDelete}>
                  <X className="mr-2 h-4 w-4" />
                  حذف
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            {/* Original Ticket */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="font-medium">{ticket.user.name}</span>
                    <Badge variant="outline">کاربر</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {new Date(ticket.created_at).toLocaleDateString('fa-IR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-wrap">{ticket.description}</p>
                  </div>
                  
                  {ticket.files.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">فایل‌های پیوست:</h4>
                      <div className="grid gap-2">
                        {ticket.files.map((file) => (
                          <div key={file.id} className="flex items-center justify-between p-2 border rounded">
                            <div className="flex items-center gap-2">
                              <File className="h-4 w-4" />
                              <span className="text-sm">{file.file_path.split('/').pop()}</span>
                              <span className="text-xs text-muted-foreground">({formatFileSize(file.file_size)})</span>
                            </div>
                            <Button size="sm" variant="ghost" onClick={() => downloadFile(file)}>
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Replies */}
            {ticket.replies.map((reply) => (
              <Card key={reply.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span className="font-medium">{reply.user.name}</span>
                      <Badge variant={reply.user.id === ticket.user.id ? "outline" : "default"}>
                        {reply.user.id === ticket.user.id ? 'کاربر' : 'ادمین'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="prose max-w-none">
                      <p className="whitespace-pre-wrap">{reply.description}</p>
                    </div>
                    
                    {reply.files.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">فایل‌های پیوست:</h4>
                        <div className="grid gap-2">
                          {reply.files.map((file) => (
                            <div key={file.id} className="flex items-center justify-between p-2 border rounded">
                              <div className="flex items-center gap-2">
                                <File className="h-4 w-4" />
                                <span className="text-sm">{file.file_path.split('/').pop()}</span>
                                <span className="text-xs text-muted-foreground">({formatFileSize(file.file_size)})</span>
                              </div>
                              <Button size="sm" variant="ghost" onClick={() => downloadFile(file)}>
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>اطلاعات تیکت</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">وضعیت</Label>
                  <div className="mt-1">{getStatusBadge(ticket.status)}</div>
                </div>
                
                <Separator />
                
                <div>
                  <Label className="text-sm font-medium">دسته‌بندی</Label>
                  <div className="mt-1 flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    <span>{ticket.category.name}</span>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">اولویت</Label>
                  <div className="mt-1 flex items-center gap-2">
                    <Flag className="h-4 w-4" />
                    <span>{ticket.priority.name}</span>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <Label className="text-sm font-medium">مسئول</Label>
                  <div className="mt-1">{ticket.admin.user.name}</div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">کاربر</Label>
                  <div className="mt-1">
                    <div className="font-medium">{ticket.user.name}</div>
                    <div className="text-sm text-muted-foreground">{ticket.user.email}</div>
                    <div className="text-sm text-muted-foreground">{ticket.user.mobile}</div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <Label className="text-sm font-medium">تاریخ ایجاد</Label>
                  <div className="mt-1 text-sm">
                    {new Date(ticket.created_at).toLocaleDateString('fa-IR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">آخرین به‌روزرسانی</Label>
                  <div className="mt-1 text-sm">
                    {new Date(ticket.updated_at).toLocaleDateString('fa-IR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Reply Dialog */}
      <Dialog open={isReplyDialogOpen} onOpenChange={setIsReplyDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>پاسخ به تیکت</DialogTitle>
            <DialogDescription>
              پاسخ خود را برای این تیکت بنویسید.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleReply}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="reply-description">متن پاسخ</Label>
                <Textarea
                  id="reply-description"
                  value={replyData.description}
                  onChange={(e) => setReplyData('description', e.target.value)}
                  placeholder="پاسخ خود را بنویسید..."
                  className="min-h-32"
                />
                {replyErrors.description && <p className="text-red-500 text-sm">{replyErrors.description}</p>}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="reply-status">وضعیت تیکت بعد از پاسخ</Label>
                <Select value={replyData.status.toString()} onValueChange={(value) => setReplyData('status', parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">باز</SelectItem>
                    <SelectItem value="2">پاسخ داده شده</SelectItem>
                    <SelectItem value="1">بسته</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsReplyDialogOpen(false)}>
                انصراف
              </Button>
              <Button type="submit" disabled={replyProcessing}>
                ارسال پاسخ
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>ویرایش تیکت</DialogTitle>
            <DialogDescription>
              اطلاعات تیکت را ویرایش کنید.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEdit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-subject">موضوع</Label>
                <Input
                  id="edit-subject"
                  value={editData.subject}
                  onChange={(e) => setEditData('subject', e.target.value)}
                  placeholder="موضوع تیکت"
                />
                {editErrors.subject && <p className="text-red-500 text-sm">{editErrors.subject}</p>}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-description">توضیحات</Label>
                <Textarea
                  id="edit-description"
                  value={editData.description}
                  onChange={(e) => setEditData('description', e.target.value)}
                  placeholder="توضیحات تیکت"
                  className="min-h-32"
                />
                {editErrors.description && <p className="text-red-500 text-sm">{editErrors.description}</p>}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                انصراف
              </Button>
              <Button type="submit" disabled={editProcessing}>
                ذخیره تغییرات
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}