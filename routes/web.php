<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/products/{id}', function ($id) {
    // فعلاً از داده‌های نمونه استفاده می‌کنیم
    $product = [
        'id' => $id,
        'name' => 'هدفون بلوتوثی JBL TUNE 760NC',
        'description' => 'هدفون بلوتوثی JBL TUNE 760NC با فناوری حذف نویز فعال، صدایی با کیفیت و طراحی راحت برای استفاده طولانی مدت. این هدفون دارای باتری قابل شارژ با عمر 35 ساعته و قابلیت اتصال سریع با تمام دستگاه‌های هوشمند است.',
        'short_description' => 'هدفون بی‌سیم با حذف نویز فعال و کیفیت صدای بالا',
        'image' => '/images/product-test.png',
        'images' => [
            '/images/product/1.webp',
            '/images/product/2.webp',
            '/images/product/3.webp',
            '/images/product/4.webp',
        ],
        'price' => 2450000,
        'originalPrice' => 2850000,
        'discount' => 14,
        'category' => 'صوتی و تصویری',
        'brand' => 'JBL',
        'stock' => 15,
        'rating' => 4.5,
        'reviews_count' => 127,
        'specifications' => [
            'نوع اتصال' => 'بلوتوث 5.0 / کابل 3.5mm',
            'پاسخ فرکانس' => '20Hz - 20kHz',
            'عمر باتری' => '35 ساعت (ANC خاموش) / 25 ساعت (ANC روشن)',
            'زمان شارژ' => '2 ساعت',
            'وزن' => '220 گرم',
            'رنگ' => 'مشکی، آبی، صورتی',
            'گارانتی' => '18 ماه',
            'ویژگی های خاص' => 'حذف نویز فعال، صدای JBL Pure Bass',
        ],
        'features' => [
            'فناوری حذف نویز فعال (ANC) برای تجربه صوتی بهتر',
            'صدای JBL Pure Bass با کیفیت استودیویی',
            'باتری قدرتمند با عمر 35 ساعته',
            'قابلیت شارژ سریع - 5 دقیقه شارژ، 3 ساعت پخش',
            'اتصال چندگانه تا 2 دستگاه همزمان',
            'کنترل لمسی هوشمند',
            'میکروفون داخلی برای تماس‌های تلفنی',
            'طراحی تاشو برای حمل آسان',
            'پشتیبانی از دستیار صوتی',
            'مقاوم و سبک برای استفاده روزانه',
        ],
        'reviews' => [
            [
                'id' => 1,
                'user_name' => 'علی محمدی',
                'avatar' => null,
                'rating' => 5,
                'title' => 'عالی برای موزیک',
                'comment' => 'واقعاً کیفیت صدا فوق‌العاده است. حذف نویز هم خیلی خوب کار می‌کنه. راضی‌ام از خریدم.',
                'date' => '1403/08/15',
                'helpful_count' => 12,
                'verified_purchase' => true,
            ],
            [
                'id' => 2,
                'user_name' => 'فاطمه احمدی',
                'avatar' => null,
                'rating' => 4,
                'title' => 'راحت و با کیفیت',
                'comment' => 'هدفون خیلی راحتی هست، ساعت‌ها می‌تونم ازش استفاده کنم. فقط کاش رنگ‌های بیشتری داشت.',
                'date' => '1403/08/10',
                'helpful_count' => 8,
                'verified_purchase' => true,
            ],
            [
                'id' => 3,
                'user_name' => 'رضا کریمی',
                'avatar' => null,
                'rating' => 5,
                'title' => 'ارزش خرید داره',
                'comment' => 'با این قیمت واقعاً ارزشش رو داره. باتریش هم خیلی خوبه، چند روز شارژش می‌کشه.',
                'date' => '1403/08/05',
                'helpful_count' => 15,
                'verified_purchase' => true,
            ],
        ],
        'related_products' => [
            [
                'id' => '2',
                'name' => 'هدفون سونی WH-CH720N',
                'image' => '/images/product/5.webp',
                'price' => 1890000,
                'originalPrice' => 2100000,
                'discount' => 10,
            ],
            [
                'id' => '3',
                'name' => 'ایرپاد اپل Pro 2',
                'image' => '/images/product/6.webp',
                'price' => 8500000,
                'originalPrice' => null,
            ],
            [
                'id' => '4',
                'name' => 'هدفون گیمینگ HyperX',
                'image' => '/images/product/7.webp',
                'price' => 1250000,
                'originalPrice' => 1450000,
                'discount' => 14,
            ],
            [
                'id' => '5',
                'name' => 'اسپیکر JBL Charge 5',
                'image' => '/images/product/8.webp',
                'price' => 3200000,
                'originalPrice' => null,
            ],
        ]
    ];
    
    return Inertia::render('ProductDetail', [
        'product' => $product
    ]);
})->name('product.show');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('admin')->name('admin.')->middleware('admin')->group(function () {
        Route::get('/', function () {
            return Inertia::render('Admin/Dashboard');
        })->name('dashboard');
        
        // User Management
        Route::resource('users', App\Http\Controllers\Admin\UserController::class)->only(['index', 'show']);
        Route::post('users/bulk-update', [App\Http\Controllers\Admin\UserController::class, 'bulkUpdate'])->name('users.bulk-update');
        Route::post('users/{user}/assign-role', [App\Http\Controllers\Admin\UserController::class, 'assignRole'])->name('users.assign-role');
        Route::post('users/{user}/remove-role', [App\Http\Controllers\Admin\UserController::class, 'removeRole'])->name('users.remove-role');
        Route::post('users/{user}/give-permission', [App\Http\Controllers\Admin\UserController::class, 'givePermission'])->name('users.give-permission');
        Route::post('users/{user}/revoke-permission', [App\Http\Controllers\Admin\UserController::class, 'revokePermission'])->name('users.revoke-permission');
        
        // Role Management
        Route::resource('roles', App\Http\Controllers\Admin\RoleController::class);
        
        // Permission Management
        Route::resource('permissions', App\Http\Controllers\Admin\PermissionController::class)->except(['show']);
        
        Route::resource('comments', App\Http\Controllers\AdminCommentController::class);
        Route::post('comments/bulk-update', [App\Http\Controllers\AdminCommentController::class, 'bulkUpdate'])->name('comments.bulk-update');
        
        Route::resource('tickets', App\Http\Controllers\Admin\TicketController::class);
        Route::post('tickets/bulk-update', [App\Http\Controllers\Admin\TicketController::class, 'bulkUpdate'])->name('tickets.bulk-update');
        
        Route::resource('ticket-categories', App\Http\Controllers\Admin\TicketCategoryController::class);
        Route::post('ticket-categories/bulk-update', [App\Http\Controllers\Admin\TicketCategoryController::class, 'bulkUpdate'])->name('ticket-categories.bulk-update');
        
        Route::resource('ticket-priorities', App\Http\Controllers\Admin\TicketPriorityController::class);
        Route::post('ticket-priorities/bulk-update', [App\Http\Controllers\Admin\TicketPriorityController::class, 'bulkUpdate'])->name('ticket-priorities.bulk-update');
    });
    
    Route::prefix('panel')->name('panel.')->group(function () {
        Route::get('/', [App\Http\Controllers\PanelController::class, 'index'])->name('index');
        Route::get('/profile', [App\Http\Controllers\PanelController::class, 'profile'])->name('profile');
        Route::get('/addresses', [App\Http\Controllers\PanelController::class, 'addresses'])->name('addresses');
        Route::get('/orders', [App\Http\Controllers\PanelController::class, 'orders'])->name('orders');
        Route::get('/transactions', [App\Http\Controllers\PanelController::class, 'transactions'])->name('transactions');
        Route::get('/lists', [App\Http\Controllers\PanelController::class, 'lists'])->name('lists');
        Route::resource('comments', App\Http\Controllers\CommentController::class);
        
        Route::resource('tickets', App\Http\Controllers\Panel\TicketController::class);
        Route::post('tickets/{ticket}/reply', [App\Http\Controllers\Panel\TicketController::class, 'reply'])->name('tickets.reply');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
