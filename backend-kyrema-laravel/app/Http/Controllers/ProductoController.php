<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductoController extends Controller
{
    public function getProductosPorTipo($tipo_producto_id)
    {
        // Obtener los campos visibles para el tipo de producto
        $camposVisibles = DB::table('campos')
            ->where('tipo_producto_id', $tipo_producto_id)
            ->where('visible', true)
            ->get(['id', 'nombre']);
    
        // Obtener los valores de esos campos para todos los productos del tipo especificado, ordenados por fecha de creación
        $valores = DB::table('valores')
            ->whereIn('campo_id', $camposVisibles->pluck('id'))
            ->orderBy('created_at', 'asc') // Ordenar por fecha de creación de forma ascendente
            ->get();
    
        // Formatear los datos
        $productos = [];
    
        foreach ($valores as $valor) {
            $campo = $camposVisibles->firstWhere('id', $valor->campo_id);
            $campoNombre = strtolower(str_replace(' ', '_', $campo->nombre));
    
            if (!isset($productos[$valor->producto_id])) {
                $productos[$valor->producto_id] = [];
            }
    
            $productos[$valor->producto_id][$campoNombre] = $valor->valor;
        }
    
        // Convertir a array de productos
        $result = array_values($productos);
    
        return response()->json($result);
    }
    
}
