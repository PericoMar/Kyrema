<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log; // Importar la clase Log

class ProductoController extends Controller
{
    public function generarPDF($id, Request $request){
        // Obtener el tipo de producto por su ID
        $tipoProducto = DB::table('tipo_producto')->find($id);

        if (!$tipoProducto) {
            abort(404, 'Tipo de producto no encontrado');
        }

        // Obtener la ruta de la plantilla desde la base de datos
        $rutaPlantilla = $tipoProducto->plantilla_path;

        // Crear un nuevo objeto Spreadsheet a partir del archivo Excel existente
        $spreadsheet = \PhpOffice\PhpSpreadsheet\IOFactory::load(storage_path('app/public/' . $rutaPlantilla));

        // Obtener la hoja activa del archivo Excel
        $sheet = $spreadsheet->getActiveSheet();

        // Agregar datos al archivo Excel (ejemplo)
        $sheet->setCellValue('A1', 'Nombre');
        $sheet->setCellValue('B1', 'Cantidad');
        $sheet->setCellValue('A2', 'Producto A');
        $sheet->setCellValue('B2', 10);

        // Guardar el archivo modificado en una nueva ubicación
        $nombreArchivoNuevo = 'archivo_modificado.xlsx';
        $rutaArchivoNuevo = storage_path('app/public/' . $nombreArchivoNuevo);
        $writer = new Xlsx($spreadsheet);
        $writer->save($rutaArchivoNuevo);

        // Redirigir a la ruta del archivo descargado
        return redirect()->route('descargar.pdf', ['nombreArchivo' => $nombreArchivoNuevo]);
    }

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
        $campos = $request->input('campos');

        // Definir el nombre de la nueva tabla usando las letras de identificación
        $nombreTabla = strtolower($letrasIdentificacion);

        // Crear la tabla en la base de datos
        Schema::create($nombreTabla, function (Blueprint $table) use ($campos) {
            $table->id();

            // Agregar campos adicionales
            $table->unsignedBigInteger('sociedad_id')->nullable();
            $table->string('sociedad')->nullable();
            $table->unsignedBigInteger('comercial_id')->nullable();

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

        // Insertar información del tipo de producto en la tabla correspondiente
        DB::table('tipo_producto')->insert([
            'letras_identificacion' => $letrasIdentificacion,
            'nombre' => $nombreProducto,
            'created_at' => Carbon::now()->format('Y-m-d\TH:i:s'),
            'updated_at' => Carbon::now()->format('Y-m-d\TH:i:s'),
        ]);
        // Obtener el ID del tipo de producto recién creado
        $tipoProductoId = DB::getPdo()->lastInsertId();

        // Insertar información de los campos en la tabla 'campos'
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
                'created_at' => Carbon::now()->format('Y-m-d\TH:i:s'),
                'updated_at' => Carbon::now()->format('Y-m-d\TH:i:s'),
                'grupo' => $campo['grupo'] ?? null,
            ]);
        }

        return response()->json(['message' => 'Producto creado con éxito'], 200);
    }

    public function subirPlantilla($letrasIdentificacion, Request $request)
    {
        if ($request->hasFile('plantilla')) {
        
            // Guardar la plantilla Excel en el sistema de archivos
            $archivoPlantilla = $request->file('plantilla');
            $rutaPlantilla = Storage::disk('public')->putFileAs('plantillas', $archivoPlantilla, $archivoPlantilla->getClientOriginalName());
            // Procesar y almacenar la plantilla como sea necesario
            //Añadimos la ruta de la plantilla a la tabla tipo_producto
            DB::table('tipo_producto')
                ->where('letras_identificacion', $letrasIdentificacion)
                ->update(['plantilla_path' => $rutaPlantilla]);

            return response()->json(['message' => 'Plantilla subida correctamente'], 200);
        } else {
            return response()->json(['error' => 'No se recibió ninguna plantilla'], 400);
        }
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

    public function getProductosByTipoAndSociedades($letrasIdentificacion, Request $request)
    {
        $sociedades = $request->query('sociedades');

        if ($sociedades) {
            $sociedades = explode(',', $sociedades);
        } else {
            $sociedades = [];
        }
        
        // Convertir letras de identificación a nombre de tabla
        $nombreTabla = strtolower($letrasIdentificacion);
        
        // Realizar consulta dinámica usando el nombre de la tabla
        $productos = DB::table($nombreTabla)
            ->when(count($sociedades) > 0, function ($query) use ($sociedades) {
                $query->whereIn('sociedad_id', $sociedades);
            })
            ->orderBy('updated_at', 'desc') // Ordenar por fecha de actualización de forma descendente
            ->get();
        
        return response()->json($productos);
    }

    public function crearProducto($letrasIdentificacion, Request $request)
    {
         // Convertir letras de identificación a nombre de tabla
        $nombreTabla = strtolower($letrasIdentificacion);
    
        // Validar los datos recibidos
        $request->validate([
            'nuevoProducto' => 'required|array',
        ]);
        
        $datos = $request->input('nuevoProducto');

        // Añadir created_at y updated_at al array de datos
        $datos['created_at'] = Carbon::now();
        $datos['updated_at'] = Carbon::now();
        
        // Insertar los datos en la tabla correspondiente
        $id = DB::table($nombreTabla)->insertGetId($datos);
        
        return response()->json(['id' => $id], 201);
    }

    public function editarProducto($letrasIdentificacion, Request $request){
        // Convertir letras de identificación a nombre de tabla
        $nombreTabla = strtolower($letrasIdentificacion);
    
        // Validar los datos recibidos
        $request->validate([
            'id' => 'required|integer',
            'producto' => 'required|array',
        ]);
        
        $datos = $request->input('productoEditado');
        $id = $datos['id'];
        
        // Actualizar los datos en la tabla correspondiente
        DB::table($nombreTabla)
            ->where('id', $id)
            ->update($datos);
        
        return response()->json(['message' => 'Producto actualizado con éxito'], 200);
    }
    
}