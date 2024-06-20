<?php

namespace App\Http\Controllers;

use App\Models\ValorAnexo;
use Illuminate\Http\Request;

class ValorAnexoController extends Controller
{
    public function index()
    {
        $valorAnexos = ValorAnexo::all();
        return response()->json($valorAnexos);
    }

    public function store(Request $request)
    {
        $request->validate([
            'campo_id' => 'required|string|max:255|exists:campos,id',
            'valor' => 'required|string|max:255',
            'producto' => 'required|string|max:255',
        ]);

        $valorAnexo = ValorAnexo::create($request->all());

        return response()->json($valorAnexo, 201);
    }

    public function show($id)
    {
        $valorAnexo = ValorAnexo::findOrFail($id);
        return response()->json($valorAnexo);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'campo_id' => 'string|max:255|exists:campos,id',
            'valor' => 'string|max:255',
            'producto' => 'string|max:255',
        ]);

        $valorAnexo = ValorAnexo::findOrFail($id);
        $valorAnexo->update($request->all());

        return response()->json($valorAnexo);
    }

    public function destroy($id)
    {
        $valorAnexo = ValorAnexo::findOrFail($id);
        $valorAnexo->delete();

        return response()->json(null, 204);
    }
}
