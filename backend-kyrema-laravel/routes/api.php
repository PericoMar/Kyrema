<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CampoController;
use App\Http\Controllers\ValorController;
use App\Http\Controllers\TipoProductoController;
use App\Http\Controllers\SociedadController;
use App\Http\Controllers\TipoProductoSociedadController;
use App\Http\Controllers\ComercialController;
use App\Http\Controllers\ComercialComisionController;
use App\Http\Controllers\TipoAnexoController;
use App\Http\Controllers\CampoAnexoController;
use App\Http\Controllers\ValorAnexoController;
use App\Http\Controllers\TarifaProductoController;
use App\Http\Controllers\TarifaAnexoController;
use App\Http\Controllers\EscaladoAnexoController;
use App\Http\Controllers\NavegacionController;
use App\Http\Controllers\CPFamiliaController;
use App\Http\Controllers\AuthController;

Route::apiResource('campos', CampoController::class);
Route::apiResource('valores', ValorController::class);
Route::apiResource('tipos-producto', TipoProductoController::class);
Route::apiResource('sociedades', SociedadController::class);
Route::apiResource('tipo-producto-sociedad', TipoProductoSociedadController::class);
Route::apiResource('comerciales', ComercialController::class);
Route::post('/auth/login', [AuthController::class, 'login']);

Route::apiResource('comercial-comisiones', ComercialComisionController::class);
Route::apiResource('tipos-anexo', TipoAnexoController::class);
Route::apiResource('campos-anexo', CampoAnexoController::class);
Route::apiResource('valores-anexo', ValorAnexoController::class);
Route::apiResource('tarifas-producto', TarifaProductoController::class);
Route::apiResource('tarifas-anexo', TarifaAnexoController::class);
Route::apiResource('escalado-anexos', EscaladoAnexoController::class);

Route::get('/nav', [NavegacionController::class, 'getNavegacion']);

Route::apiResource('cp-familia', CPFamiliaController::class);
