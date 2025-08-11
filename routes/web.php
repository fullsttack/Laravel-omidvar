<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('admin')->name('admin.')->group(function () {
        Route::get('/', function () {
            return Inertia::render('Admin/Dashboard');
        })->name('dashboard');
        
        Route::resource('comments', App\Http\Controllers\AdminCommentController::class);
        Route::post('comments/bulk-update', [App\Http\Controllers\AdminCommentController::class, 'bulkUpdate'])->name('comments.bulk-update');
    });
    
    Route::prefix('panel')->name('panel.')->group(function () {
        Route::get('/', [App\Http\Controllers\PanelController::class, 'index'])->name('index');
        Route::get('/profile', [App\Http\Controllers\PanelController::class, 'profile'])->name('profile');
        Route::get('/addresses', [App\Http\Controllers\PanelController::class, 'addresses'])->name('addresses');
        Route::get('/orders', [App\Http\Controllers\PanelController::class, 'orders'])->name('orders');
        Route::get('/transactions', [App\Http\Controllers\PanelController::class, 'transactions'])->name('transactions');
        Route::get('/lists', [App\Http\Controllers\PanelController::class, 'lists'])->name('lists');
        Route::get('/tickets', [App\Http\Controllers\PanelController::class, 'tickets'])->name('tickets');
        
        Route::resource('comments', App\Http\Controllers\CommentController::class);
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
