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
use App\Http\Controllers\ProductoController;



// Route::get('/productos/{letras_identificativas}', [ProductoController::class, 'getProductosPorTipo']);

Route::get('/productos/{letrasIdentificacion}', [ProductoController::class, 'getProductosByTipoAndSociedades']);

Route::post('/crear-producto/{letrasIdentificacion}', [ProductoController::class, 'crearProducto']);

Route::post('/crear-tipo-producto', [ProductoController::class, 'crearTipoProducto']);
Route::post('/subir-plantilla/{letrasIdentificacion}', [ProductoController::class, 'subirPlantilla']);


Route::apiResource('campos', CampoController::class);
Route::get('/campos', [CampoController::class, 'getByTipoProducto']);

Route::apiResource('valores', ValorController::class);

Route::apiResource('tipos-producto', TipoProductoController::class);
Route::get('tipo-producto/{letras}', [TipoProductoController::class, 'getByLetras']);
Route::get('tipo-producto/show/{ruta}', [TipoProductoController::class, 'show']);

Route::get('sociedad/{id}', [SociedadController::class, 'show']);
Route::get('sociedad/hijas/{id}', [SociedadController::class, 'getSociedadesHijas']);


Route::apiResource('tipo-producto-sociedad', TipoProductoSociedadController::class);

Route::apiResource('comerciales', ComercialController::class);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::get('/comercial/{id}', [ComercialController::class, 'show']);

Route::apiResource('comercial-comisiones', ComercialComisionController::class);
Route::apiResource('tipos-anexo', TipoAnexoController::class);
Route::apiResource('campos-anexo', CampoAnexoController::class);
Route::apiResource('valores-anexo', ValorAnexoController::class);
Route::apiResource('tarifas-producto', TarifaProductoController::class);
Route::apiResource('tarifas-anexo', TarifaAnexoController::class);
Route::apiResource('escalado-anexos', EscaladoAnexoController::class);

Route::get('/nav', [NavegacionController::class, 'getNavegacion']);

Route::apiResource('cp-familia', CPFamiliaController::class);
