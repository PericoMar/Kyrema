<?php

namespace App\Http\Controllers;

use App\Models\TarifaProducto;
use Illuminate\Http\Request;

class TarifaProductoController extends Controller
{
    public function index()
    {
        $tarifaProductos = TarifaProducto::all();
        return response()->json($tarifaProductos);
    }

    public function store(Request $request)
    {
        $request->validate([
            'producto' => 'required|string|max:255',
            'id_sociedad' => 'required|string|max:255|exists:sociedades,id',
            'prima_seguro' => 'required|numeric',
            'cuota_asociacion' => 'required|numeric',
            'precio_total' => 'required|numeric',
        ]);

        $tarifaProducto = TarifaProducto::create($request->all());

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
            'producto' => 'string|max:255',
            'id_sociedad' => 'string|max:255|exists:sociedades,id',
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
