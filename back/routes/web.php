<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PostController;
use App\Mail\PostCreated;
use App\Models\Post;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Route;


Route::get('/posts', function () {
    phpinfo();
    $post = Post::find(1);
    $postArr = $post->toArray();
    $postArr['likes_count'] = $post->likedByUsers()->count();
    // $post_likes = $post->likedByUsers()->count();


    return view('post', ['liked' => $postArr]);
});

Route::get('/test', function () {
    dispatch(function () {
        logger('hellCCCo');
    })->delay(now()->addSeconds(10));
    return 'Test email sent!';
});
