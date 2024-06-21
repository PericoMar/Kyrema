<?php

namespace App\Http\Controllers;

use App\Models\TipoAnexo;
use Illuminate\Http\Request;

class TipoAnexoController extends Controller
{
    public function index()
    {
        $tipoAnexos = TipoAnexo::all();
        return response()->json($tipoAnexos);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'id_familia' => 'nullable|string|max:255',
        ]);

        $tipoAnexo = TipoAnexo::create($request->all());

        return response()->json($tipoAnexo, 201);
    }

    public function show($id)
    {
        $tipoAnexo = TipoAnexo::findOrFail($id);
        return response()->json($tipoAnexo);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'nombre' => 'string|max:255',
            'id_familia' => 'nullable|string|max:255',
        ]);

        $tipoAnexo = TipoAnexo::findOrFail($id);
        $tipoAnexo->update($request->all());

        return response()->json($tipoAnexo);
    }

    public function destroy($id)
    {
        $tipoAnexo = TipoAnexo::findOrFail($id);
        $tipoAnexo->delete();

        return response()->json(null, 204);
    }
}
