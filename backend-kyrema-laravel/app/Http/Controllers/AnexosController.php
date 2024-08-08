<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Carbon\Carbon;
use App\Models\TiposAnexos;
use App\Models\TipoProductoSociedad;

class AnexosController extends Controller
{
    public function conectarAnexosConProducto($id_producto, Request $request){
        // Me llegará un array con todos los anexos que tengo que crear y conectar con el producto
        // Si ya tiene un id se cambia el mismo anexo sino se crea unno nuevo
        // El formato en el que llegan los anexos es el siguiente:
        // {id: '', formato: this.formatosAnexos[tipo_anexo.id], tipo_anexo: tipo_anexo}
        // La tabla en la que hay que meterlos es la siguiente:
        // SELECT TOP (1000) [id]
        //     ,[producto_id]
        //     ,[perro_asegurado]
        //     ,[created_at]
        //     ,[updated_at]
        // FROM [KYREMA].[dbo].[letras_identificacion que estan dentro del tipo_anexo]
        // Obtener el array de anexos desde el request
        $anexos = $request->input('anexos');

        foreach ($anexos as $anexo) {
            $tipoAnexo = $anexo['tipo_anexo']; // Tipo de anexo
            $letrasIdentificacion = strtolower($tipoAnexo['letras_identificacion']); // Nombre de la tabla
            $anexoId = $anexo['id']; // ID del anexo (si existe)
            $formato = $anexo['formato']; // Campos dinámicos del anexo

            // Verificar que la tabla existe
            if (Schema::hasTable($letrasIdentificacion)) {
                // Construir los datos a insertar/actualizar, agregando siempre el id_producto y las marcas de tiempo
                $data = [
                    'producto_id' => $id_producto,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];

                // Agregar los campos dinámicos del formato
                foreach ($formato as $key => $value) {
                    $data[$key] = $value;
                }

                if ($anexoId) {
                    // Si el anexo tiene un ID, se actualiza el registro existente
                    DB::table($letrasIdentificacion)->where('id', $anexoId)->update($data);
                } else {
                    // Si no tiene ID, se crea un nuevo registro
                    DB::table($letrasIdentificacion)->insert($data);
                }
            } else {
                return response()->json(['error' => "La tabla {$letrasIdentificacion} no existe."], 400);
            }
        }
        return response()->json(['message' => 'Anexos conectados con éxito'], 200);
    }

    public function createTipoAnexo(Request $request){
         // Validar los datos recibidos
        $request->validate([
            'nombre' => 'required|string',
            'letras_identificacion' => 'required|string',
            'campos' => 'required|array',
            'campos.*.nombre' => 'required|string',
            'campos.*.tipoDato' => 'required|string|in:text,number,date,decimal',
            'tipoProductoAsociado' => 'required|integer|exists:tipo_producto,id',
        ]);

        $nombre = $request->input('nombre');
        $letrasIdentificacion = $request->input('letras_identificacion');
        $campos = $request->input('campos');
        $tipoProductoAsociado = $request->input('tipoProductoAsociado');

        // Definir el nombre de la nueva tabla usando las letras de identificación
        $nombreTabla = strtolower($letrasIdentificacion);

        // Crear la tabla en la base de datos
        Schema::create($nombreTabla, function (Blueprint $table) use ($campos) {
            $table->id();

            // Agregar campos adicionales
            $table->unsignedBigInteger('producto_id')->nullable();

            foreach ($campos as $campo) {
                $nombreCampo = strtolower(str_replace(' ', '_', $campo['nombre']));
                switch ($campo['tipoDato']) {
                    case 'text':
                        $table->string($nombreCampo)->nullable();
                        break;
                    case 'decimal':
                        $table->decimal($nombreCampo, 10, 2)->nullable();
                        break;
                    case 'number':
                        $table->integer($nombreCampo)->nullable();
                        break;
                    case 'date':
                        $table->date($nombreCampo)->nullable();
                        break;
                }
            }
            $table->timestamps();
        });

        // Insertar información del tipo de anexo en la tabla correspondiente y obtener el ID
        $tipoAnexoId = DB::table('tipos_anexos')->insertGetId([
            'nombre' => $nombre,
            'letras_identificacion' => $letrasIdentificacion,
            'id_tipo_producto' => $tipoProductoAsociado,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Insertar información de los campos en la tabla 'campos_anexos'
        foreach ($campos as $campo) {
            DB::table('campos_anexos')->insert([
                'nombre' => $campo['nombre'],
                //nombre_codigo es el nombre pero todo en minusculas y reemplazando los espacios por guiones bajos
                'nombre_codigo' => strtolower(str_replace(' ', '_', $campo['nombre'])),
                'tipo_anexo' => $tipoAnexoId,
                'columna' => $campo['columna'] ?? null,
                'fila' => $campo['fila'] ?? null,
                'tipo_dato' => $campo['tipoDato'],
                'obligatorio' => $campo['obligatorio'] ?? false,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        return response()->json([
            'message' => 'Anexo creado con éxito',
            'id' => $tipoAnexoId
        ], 200);
    }

    public function getAnexosPorProducto($id_tipo_producto , $id_producto){ 
        // IMPORTANTE PUEDE HABER MÁS DE UN TIPO ANEXO POR TIPO PRODUCTO
        // Necesito coger todos las letras_identificacion e ids de TiposAnexos que tengan id_tipo_producto = $id_tipo_producto

        // Las letras_identificacion usarlas como nombres de tablas y coger todos los anexos relacionados con el $id_producto y poner el anexo con el siguiente formato:
        // {id: '', formato: this.formatosAnexos[tipo_anexo.id], tipo_anexo: tipo_anexo} (Es decir que el tipo_anexo me lo deberia de haber guardado previamente)
        
         // Obtener los tipos de anexos asociados al tipo de producto
        $tiposAnexos = DB::table('tipos_anexos')
        ->where('id_tipo_producto', $id_tipo_producto)
        ->get();

        $anexos = [];

        // Iterar sobre los tipos de anexos para buscar en las tablas correspondientes
        foreach ($tiposAnexos as $tipoAnexo) {
            $nombreTabla = strtolower($tipoAnexo->letras_identificacion);

            if (Schema::hasTable($nombreTabla)) {
                // Obtener los anexos de la tabla correspondiente al tipo de anexo
                $anexosDeTabla = DB::table($nombreTabla)
                    ->where('producto_id', $id_producto)
                    ->get();

                // Formatear cada anexo con el formato especificado
                foreach ($anexosDeTabla as $anexo) {
                    $anexos[] = [
                        'id' => $anexo->id,
                        // El formato son todos los campos excepto los campos de control (producto_id, created_at, updated_at)
                        'formato' => collect($anexo)->except(['id', 'producto_id', 'created_at', 'updated_at'])->toArray(),
                        'tipo_anexo' => $tipoAnexo
                    ];
                }
            }
        }

        return response()->json($anexos);
    }



    public function getAnexosPorSociedad($id_sociedad){
        //Cogemos todos los tipos_productos asociados a esta sociedad:
        $tiposProductoSociedad = TipoProductoSociedad::where('id_sociedad', $id_sociedad)->get();
        $tiposProductoSociedadIds = $tiposProductoSociedad->pluck('id');

        //Cogemos todos los tipos_anexo asociados a estos tipos_productos:
        $tiposAnexo = TiposAnexos::whereIn('id_tipo_producto', $tiposProductoSociedadIds)->get();

        return response()->json($tiposAnexo);
    }

    public function getTipoAnexosPorTipoProducto($id_tipo_producto){

        $tiposAnexo = TiposAnexos::where('id_tipo_producto', $id_tipo_producto)->get();

        return response()->json($tiposAnexo);

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        
        $tipoAnexo = TiposAnexos::findOrFail($id);

        // Borrar la tabla asociada al tipo de anexo
        $letrasIdentificacion = $tipoAnexo->letras_identificacion;
        $nombreTabla = strtolower($letrasIdentificacion);
        Schema::dropIfExists($nombreTabla);

        // Borrar el tipo de anexo de la base de datos
        $tipoAnexo->delete();

        // Borrar los campos asociados al tipo de anexo
        DB::table('campos_anexos')->where('tipo_anexo', $id)->delete();

        //Eliminar las tarifas asociadas al tipo de anexo
        DB::table('tarifas_anexos')->where('id_tipo_anexo', $id)->delete();

        return response()->json(null, 204);
    }
}
