<?php

namespace App\Http\Controllers;

use App\Models\CampoAnexo;
use Illuminate\Http\Request;

class CampoAnexoController extends Controller
{
    public function index()
    {
        $campoAnexos = CampoAnexo::all();
        return response()->json($campoAnexos);
    }

    public function store(Request $request)
    {
        $request->validate([
            'campo_id' => 'required|string|max:255|exists:campos,id',
            'tipo_anexo' => 'required|string|max:255|exists:tipo_anexos,id',
            'obligatorio' => 'required|boolean',
        ]);

        $campoAnexo = CampoAnexo::create($request->all());

        return response()->json($campoAnexo, 201);
    }

    public function show($id)
    {
        $campoAnexo = CampoAnexo::findOrFail($id);
        return response()->json($campoAnexo);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'campo_id' => 'string|max:255|exists:campos,id',
            'tipo_anexo' => 'string|max:255|exists:tipo_anexos,id',
            'obligatorio' => 'boolean',
        ]);

        $campoAnexo = CampoAnexo::findOrFail($id);
        $campoAnexo->update($request->all());

        return response()->json($campoAnexo);
    }

    public function destroy($id)
    {
        $campoAnexo = CampoAnexo::findOrFail($id);
        $campoAnexo->delete();

        return response()->json(null, 204);
    }
}

