<?php

use Illuminate\Support\Facades\Route;

Route::get('/simple-test', function () {
    return response()->json([
        'message' => 'Simple test route working!',
        'time' => date('Y-m-d H:i:s')
    ]);
});
