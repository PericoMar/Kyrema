<?php

namespace App\Http\Controllers;

use App\Models\Valor;
use Illuminate\Http\Request;

class ValorController extends Controller
{
    public function index()
    {
        $valores = Valor::all();
        return response()->json($valores);
    }

    public function store(Request $request)
    {
        $request->validate([
            'campo_id' => 'required|string|max:255',
            'valor' => 'required|string|max:255',
            'producto_id' => 'required|string|max:255',
        ]);

        $valor = Valor::create($request->all());

        return response()->json($valor, 201);
    }

    public function show($campo_id, $producto_id)
    {
        $valor = Valor::where('campo_id', $campo_id)->where('producto_id', $producto_id)->firstOrFail();
        return response()->json($valor);
    }

    public function update(Request $request, $campo_id, $producto_id)
    {
        $request->validate([
            'valor' => 'string|max:255',
        ]);

        $valor = Valor::where('campo_id', $campo_id)->where('producto_id', $producto_id)->firstOrFail();
        $valor->update($request->all());

        return response()->json($valor);
    }

    public function destroy($campo_id, $producto_id)
    {
        $valor = Valor::where('campo_id', $campo_id)->where('producto_id', $producto_id)->firstOrFail();
        $valor->delete();

        return response()->json(null, 204);
    }
}
