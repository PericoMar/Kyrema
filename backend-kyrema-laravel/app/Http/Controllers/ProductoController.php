<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;

class ProductoController extends Controller
{
    public function crearTipoProducto(Request $request)
    {
        // Validar los datos recibidos
        $request->validate([
            'nombreProducto' => 'required|string',
            'letrasIdentificacion' => 'required|string',
            'campos' => 'required|array',
            'campos.*.nombre' => 'required|string',
            'campos.*.tipoDato' => 'required|string|in:texto,numero,fecha',
        ]);

        $nombreProducto = $request->input('nombreProducto');
        $letrasIdentificacion = $request->input('letrasIdentificacion');
        $plantilla = $request->input('plantilla');
        $campos = $request->input('campos');

        // Definir el nombre de la nueva tabla usando las letras de identificación
        $nombreTabla = strtolower($letrasIdentificacion);

        // Crear la tabla en la base de datos
        Schema::create($nombreTabla, function (Blueprint $table) use ($campos) {
            $table->id();
            foreach ($campos as $campo) {
                $nombreCampo = strtolower(str_replace(' ', '_', $campo['nombre']));
                switch ($campo['tipoDato']) {
                    case 'texto':
                        $table->string($nombreCampo)->nullable();
                        break;
                    case 'numero':
                        $table->integer($nombreCampo)->nullable();
                        break;
                    case 'fecha':
                        $table->date($nombreCampo)->nullable();
                        break;
                }
            }
            $table->timestamps();

        });

        DB::table('tipo_producto')->insert([
            'letras_identificacion' => $letrasIdentificacion,
            'plantilla_path' => $plantilla,
            'nombre' => $nombreProducto,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $tipoProductoId = DB::getPdo()->lastInsertId();

        foreach ($campos as $campo) {
            DB::table('campos')->insert([
                'id' => uniqid(),
                'nombre' => $campo['nombre'],
                'tipo_producto_id' => $tipoProductoId,
                'columna' => $campo['columna'] ?? null,
                'fila' => $campo['fila'] ?? null,
                'tipo_dato' => $campo['tipoDato'],
                'visible' => $campo['visible'] ?? false,
                'obligatorio' => $campo['obligatorio'] ?? false,
                'aparece_formulario' => $campo['formulario'] ?? false,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        return response()->json(['message' => 'Producto creado con éxito'], 200);
    }

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

    public function getProductosByTipoAndSociedades($id_tipo_producto, Request $request)
    {
        $sociedades = $request->query('sociedades');

        if ($sociedades) {
            $sociedades = explode(',', $sociedades);
        } else {
            $sociedades = [];
        }

        $productos = Producto::where('tipo_producto_id', $id_tipo_producto)
            ->when(count($sociedades) > 0, function ($query) use ($sociedades) {
                $query->whereIn('sociedad_id', $sociedades);
            })
            ->get();

        return response()->json($productos);
    }
    
}
