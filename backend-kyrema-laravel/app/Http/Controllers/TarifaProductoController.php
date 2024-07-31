<?php

namespace App\Http\Controllers;

use App\Models\TarifasProducto;
use Illuminate\Http\Request;
use Carbon\Carbon;

class TarifaProductoController extends Controller
{
    const SOCIEDAD_ADMIN_ID = '1';
    
    public function getTarifaPorSociedad($id_sociedad)
    {
        // Primero, intenta obtener las tarifas asociadas con el id_sociedad proporcionado
        $tarifas = TarifasProducto::where('id_sociedad', $id_sociedad)->get();

        // Si no hay tarifas para el id_sociedad, obtiene las tarifas con sociedad_id SOCIEDAD_ADMIN_ID 
        if ($tarifas->isEmpty()) {
            $tarifas = TarifasProducto::where('id_sociedad', self::SOCIEDAD_ADMIN_ID)->get();
        }

        // Devuelve las tarifas en formato JSON
        return response()->json($tarifas);
    }

    public function getTarifaPorProducto($id_producto)
    {
        // Intenta obtener las tarifas asociadas con el id_producto proporcionado
        $tarifas = TarifasProducto::where('id_producto', $id_producto)->get();

        // Si no hay tarifas para el id_producto, obtiene las tarifas con producto_id nulo
        if ($tarifas->isEmpty()) {
            $tarifas = TarifasProducto::where('id_producto', null)->get();
        }

        // Devuelve las tarifas en formato JSON
        return response()->json($tarifas);
    }

    public function getTarifaPorSociedadAndTipoProducto($id_sociedad, Request $request){
        // Primero obtenemos de la request el id del tipo de producto
        $id_tipo_producto = $request->input('tipo_producto_id');

        // Intenta obtener las tarifas asociadas con el id_sociedad y el id_tipo_producto proporcionados
        $tarifas = TarifasProducto::where('id_sociedad', $id_sociedad)->where('tipo_producto_id', $id_tipo_producto)->get();

        // Si no hay tarifas para el id_sociedad y el id_tipo_producto, obtiene las tarifas con sociedad_id SOCIEDAD_ADMIN_ID y el tipo_producto_id proporcionado
        if ($tarifas->isEmpty()) {
            $tarifas = TarifasProducto::where('id_sociedad', self::SOCIEDAD_ADMIN_ID)->where('tipo_producto_id', $id_tipo_producto)->get();
        }

        // Devuelve las tarifas en formato JSON
        return response()->json($tarifas);
    }

    public function updateTarifaPorSociedad($sociedad_id, Request $request)
    {
        // Coge la tarifa de la resquest donde estara el id del tipo_producto y los precios
        $tarifa = $request->input('tarifa');

        // Cambia los datos de esta sociedad y el id de dentro de $tarifa con los datos de $tarifa.
        TarifasProducto::where('id_sociedad', $sociedad_id)->update($tarifa);

        // Devuelve un mensaje de éxito
        return response()->json(['message' => 'Tarifa actualizada con éxito'], 200);

    }

    public function index()
    {
        $tarifaProductos = TarifaProducto::all();
        return response()->json($tarifaProductos);
    }

    public function store(Request $request)
    {
        // Validar los datos recibidos
        $request->validate([
            'tipo_producto_id' => 'required|numeric',
            'id_sociedad' => 'required|numeric',
            'prima_seguro' => 'required|numeric',
            'cuota_asociacion' => 'required|numeric',
            'precio_total' => 'required|numeric',
        ]);

        // Crear el nuevo registro en la base de datos con el ID generado
        $tarifaProducto = TarifasProducto::create([
            'tipo_producto_id' => $request->input('tipo_producto_id'),
            'id_sociedad' => $request->input('id_sociedad'),
            'prima_seguro' => $request->input('prima_seguro'),
            'cuota_asociacion' => $request->input('cuota_asociacion'),
            'precio_total' => $request->input('precio_total'),
        ]);

        return response()->json($tarifaProducto, 201);
    }

    public function show($id)
    {
        $tarifaProducto = TarifaProducto::findOrFail($id);
        return response()->json($tarifaProducto);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'tipo_producto_id' => 'numeric|exists:tipo_producto,id',
            'id_sociedad' => 'numeric|exists:sociedad,id',
            'prima_seguro' => 'numeric',
            'cuota_asociacion' => 'numeric',
            'precio_total' => 'numeric',
        ]);

        $tarifaProducto = TarifaProducto::findOrFail($id);
        $tarifaProducto->update($request->all());

        return response()->json($tarifaProducto);
    }

    public function destroy($id)
    {
        $tarifaProducto = TarifaProducto::findOrFail($id);
        $tarifaProducto->delete();

        return response()->json(null, 204);
    }
}
