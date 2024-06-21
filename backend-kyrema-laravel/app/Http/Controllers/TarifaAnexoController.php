<?php

namespace App\Http\Controllers;

use App\Models\TarifaAnexo;
use Illuminate\Http\Request;

class TarifaAnexoController extends Controller
{
    public function index()
    {
        $tarifaAnexos = TarifaAnexo::all();
        return response()->json($tarifaAnexos);
    }

    public function store(Request $request)
    {
        $request->validate([
            'anexo' => 'required|string|max:255|exists:tipo_anexos,id',
            'tiene_escala' => 'required|boolean',
            'id_producto' => 'required|string|max:255|exists:tarifa_productos,id',
            'precio' => 'required|numeric',
        ]);

        $tarifaAnexo = TarifaAnexo::create($request->all());

        return response()->json($tarifaAnexo, 201);
    }

    public function show($id)
    {
        $tarifaAnexo = TarifaAnexo::findOrFail($id);
        return response()->json($tarifaAnexo);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'anexo' => 'string|max:255|exists:tipo_anexos,id',
            'tiene_escala' => 'boolean',
            'id_producto' => 'string|max:255|exists:tarifa_productos,id',
            'precio' => 'numeric',
        ]);

        $tarifaAnexo = TarifaAnexo::findOrFail($id);
        $tarifaAnexo->update($request->all());

        return response()->json($tarifaAnexo);
    }

    public function destroy($id)
    {
        $tarifaAnexo = TarifaAnexo::findOrFail($id);
        $tarifaAnexo->delete();

        return response()->json(null, 204);
    }
}
