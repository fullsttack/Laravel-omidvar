<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Comment;

class TestCommentsSeeder extends Seeder
{
    public function run(): void
    {
        // Find or create test user
        $user = User::where('mobile', '09129742210')->first();
        if (!$user) {
            $user = User::create([
                'name' => 'کاربر تست',
                'mobile' => '09129742210',
                'email' => 'test@example.com',
                'password' => bcrypt('password'),
                'activation' => 1,
                'activation_date' => now(),
                'user_type' => 0,
                'status' => 0,
            ]);
        }

        // Create test comments
        $comments = [
            [
                'body' => 'این یک کامنت تست است. محصول بسیار خوبی بود و کیفیت آن عالی است.',
                'commentable_type' => 'Product',
                'commentable_id' => 1,
                'approved' => 1,
                'seen' => 1,
                'status' => 1,
            ],
            [
                'body' => 'سلام، من این محصول را خریدم و واقعا راضی هستم. پیشنهاد می‌کنم.',
                'commentable_type' => 'Product', 
                'commentable_id' => 1,
                'approved' => 1,
                'seen' => 1,
                'status' => 1,
            ],
            [
                'body' => 'کامنت در انتظار تایید - این کامنت هنوز تایید نشده است.',
                'commentable_type' => 'Product',
                'commentable_id' => 2,
                'approved' => 0,
                'seen' => 0,
                'status' => 1,
            ],
            [
                'body' => 'ارسال سریع و بسته‌بندی عالی. ممنون از فروشگاه',
                'commentable_type' => 'Post',
                'commentable_id' => 1,
                'approved' => 1,
                'seen' => 1,
                'status' => 1,
            ],
            [
                'body' => 'سوال: آیا این محصول گارانتی دارد؟',
                'commentable_type' => 'Product',
                'commentable_id' => 3,
                'approved' => 0,
                'seen' => 0,
                'status' => 1,
            ],
            [
                'body' => 'این کامنت رد شده است - محتوای نامناسب داشته.',
                'commentable_type' => 'Product',
                'commentable_id' => 4,
                'approved' => 2,
                'seen' => 1,
                'status' => 1,
            ],
            [
                'body' => 'کامنت spam - این پیام تبلیغاتی بود و رد شد.',
                'commentable_type' => 'Post',
                'commentable_id' => 2,
                'approved' => 2,
                'seen' => 1,
                'status' => 1,
            ]
        ];

        foreach ($comments as $commentData) {
            $comment = Comment::create([
                'body' => $commentData['body'],
                'author_id' => $user->id,
                'commentable_type' => $commentData['commentable_type'],
                'commentable_id' => $commentData['commentable_id'],
                'approved' => $commentData['approved'],
                'seen' => $commentData['seen'],
                'status' => $commentData['status'],
            ]);
        }

        // Create a reply comment
        $parentComment = Comment::first();
        if ($parentComment) {
            Comment::create([
                'body' => 'پاسخ: بله، این محصول دارای 2 سال گارانتی است.',
                'author_id' => $user->id,
                'parent_id' => $parentComment->id,
                'commentable_type' => $parentComment->commentable_type,
                'commentable_id' => $parentComment->commentable_id,
                'approved' => 1,
                'seen' => 1,
                'status' => 1,
            ]);
        }

        $this->command->info('Test comments created successfully!');
        $this->command->info("User: {$user->name} (ID: {$user->id})");
        $this->command->info("Created " . Comment::count() . " comments");
        $this->command->info("Approved: " . Comment::approved()->count());
        $this->command->info("Pending: " . Comment::unapproved()->count());
        $this->command->info("Rejected: " . Comment::rejected()->count());
    }
}