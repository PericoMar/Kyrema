<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/products',function(){
    return 'products';
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
