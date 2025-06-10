<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\SavedPostController;
use App\Http\Controllers\LikePostController;
use App\Http\Controllers\UserController;

// Public Auth Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/googleAuth', [AuthController::class, 'redirectToAuth']);
Route::get('/auth/callback', [AuthController::class, 'handleAuthCallback']);

// Token Validation
Route::middleware('auth:sanctum')->get('/auth/validate', function () {
    return response()->json(['message' => 'Token is valid'], 200);
});

// User Routes
Route::middleware('auth:sanctum')->prefix('user')->group(function () {
    Route::patch('/', [UserController::class, 'updateUserData']);
    Route::delete('/', [UserController::class, 'deleteUserAccount']);
    Route::get('/posts', [PostController::class, 'getUserPosts']);
    Route::get('/posts/saved', [PostController::class, 'getSavedPosts']);
    Route::get('/posts/{id}', [PostController::class, 'getUserPost']); // for edit/delete
});

// Visited User Profile
Route::middleware('auth:sanctum')->get('/users/{user}', [UserController::class, 'getVisitedUser']);

// Post Routes
Route::middleware('auth:sanctum')->prefix('posts')->group(function () {
    Route::get('/home', [PostController::class, 'getHomePosts']);
    Route::get('/search', [PostController::class, 'postSearch']);
    Route::get('/{id}', [PostController::class, 'getPost']); // public view

    Route::post('/', [PostController::class, 'store']);
    Route::patch('/{post}', [PostController::class, 'update'])->middleware('can:update,post');
    Route::delete('/{post}', [PostController::class, 'delete'])->middleware('can:delete,post');

    Route::post('/{post}/save', [SavedPostController::class, 'toggle']);
    Route::post('/{post}/like', [LikePostController::class, 'toggle']);
});

// Misc
Route::get('/img', fn() => response()->json([
    'img' => 'posts/deYx5CcsQ7amYYPxachEJQVRVpRktb4u1MoC8bpj.jpg.webp'
], 200));

Route::middleware('auth:sanctum')->get('/first_post', [PostController::class, 'firstPost']);


// Before

/*
Route::options('*', function () {
    return response()->json([], 200);
});

Route::get('googleAuth', [AuthController::class, 'redirectToAuth']);
Route::get('auth/callback', [AuthController::class, 'handleAuthCallback']);

Route::middleware('auth:sanctum')->get('/auth/validate', function () {
    return response()->json(['message' => 'Token is valid'], 200);
});

Route::post('/user_update', [UserController::class, 'updateUserData'])->middleware('auth:sanctum');
Route::delete('/user_delete', [UserController::class, 'deleteUserAccount'])->middleware('auth:sanctum');

Route::get('/visited_user/{user}', [UserController::class, 'get_visited_user'])->middleware('auth:sanctum');

Route::get('/img', fn() => response()->json(['img' => 'posts/deYx5CcsQ7amYYPxachEJQVRVpRktb4u1MoC8bpj.jpg.webp'], 200));
Route::get('/first_post', [PostController::class, 'first_post'])->middleware('auth:sanctum');

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/create_post', [PostController::class, 'create_post'])->middleware('auth:sanctum');
Route::post('/update_post/{post}', [PostController::class, 'update_post'])->middleware(['auth:sanctum', 'can:update,post']);
Route::delete('/delete_post/{post}', [PostController::class, 'delete_post'])->middleware(['auth:sanctum', 'can:delete,post']);
Route::post('/add_like', [PostController::class, 'add_like'])->middleware('auth:sanctum');
Route::post('/save_post/{post}', [SavedPostController::class, 'toggleSavedPost'])->middleware('auth:sanctum');
Route::post('/like_post/{post}', [LikePostController::class, 'likePost'])->middleware('auth:sanctum');
//(private) get user posts
Route::get('/user_posts', [PostController::class, 'get_user_posts'])->middleware('auth:sanctum');
Route::get('/saved_posts', [PostController::class, 'get_saved_posts'])->middleware('auth:sanctum');
//(public) get post for view all posts currently public
Route::get('/post_view/{id}', [PostController::class, 'get_post_view'])->middleware('auth:sanctum');
//(private) get post for edit and delete page
Route::get('/post_action/{id}', [PostController::class, 'get_post_edit'])->middleware('auth:sanctum');
//(public)
Route::get('/home_posts', [PostController::class, 'get_home_posts'])->middleware('auth:sanctum');
Route::get('/search', [PostController::class, 'post_search'])->middleware('auth:sanctum');
*/
