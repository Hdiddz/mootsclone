<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DiscoverController;
use App\Http\Controllers\MatchController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\AiAssistantController;
use Illuminate\Support\Facades\Route;

// Health check
Route::get('/health', fn() => response()->json(['status' => 'ok', 'app' => 'Mutualizm', 'version' => '1.0.0']));

// Public auth routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);
Route::post('/ai/suggest', [AiAssistantController::class, 'suggest'])->middleware('throttle:20,1');

// Authenticated routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Profile
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::post('/profile/avatar', [ProfileController::class, 'uploadAvatar']);
    Route::get('/users/{id}', [ProfileController::class, 'showUser']);

    // Discover
    Route::get('/discover', [DiscoverController::class, 'index']);
    Route::post('/swipe', [DiscoverController::class, 'swipe']);

    // Matches
    Route::get('/matches', [MatchController::class, 'index']);

    // Chat
    Route::get('/matches/{matchId}/messages', [ChatController::class, 'messages']);
    Route::post('/matches/{matchId}/messages', [ChatController::class, 'send']);

    // Projects
    Route::get('/projects', [ProjectController::class, 'index']);
    Route::post('/projects', [ProjectController::class, 'store']);
    Route::get('/projects/{id}', [ProjectController::class, 'show']);
    Route::post('/projects/{id}/join', [ProjectController::class, 'join']);

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::put('/notifications/{id}/read', [NotificationController::class, 'markRead']);
    Route::put('/notifications/read-all', [NotificationController::class, 'markAllRead']);
});
