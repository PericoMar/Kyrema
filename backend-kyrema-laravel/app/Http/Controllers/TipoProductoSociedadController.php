<?php

namespace App\Http\Controllers;

use App\Models\TipoProductoSociedad;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TipoProductoSociedadController extends Controller
{


    public function index()
    {
        $tipoProductoSociedades = TipoProductoSociedad::all();
        return response()->json($tipoProductoSociedades);
    }

    public function store(Request $request)
    {
        $request->validate([
            'id_sociedad' => 'required|numeric|exists:sociedad,id',
            'id_tipo_producto' => 'required|numeric|exists:tipo_producto,id',
        ]);
        

        $tipoProductoSociedad = TipoProductoSociedad::create($request->all());

        return response()->json($tipoProductoSociedad, 201);
    }

    public function show($id)
    {
        $tipoProductoSociedad = TipoProductoSociedad::findOrFail($id);
        return response()->json($tipoProductoSociedad);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'id_sociedad' => 'numeric|exists:sociedades,id',
            'id_tipo_producto' => 'numeric|exists:tipo_productos,id',
        ]);

        $tipoProductoSociedad = TipoProductoSociedad::findOrFail($id);
        $tipoProductoSociedad->update($request->all());

        return response()->json($tipoProductoSociedad);
    }

    public function destroy($id)
    {
        $tipoProductoSociedad = TipoProductoSociedad::findOrFail($id);
        $tipoProductoSociedad->delete();

        return response()->json(null, 204);
    }
}
