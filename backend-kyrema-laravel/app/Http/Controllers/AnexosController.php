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
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
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
