<?php

namespace App\Http\Controllers;

use App\Models\Sociedad;
use Illuminate\Http\Request;

class SociedadController extends Controller
{
    public function index()
    {
        $sociedades = Sociedad::all();
        return response()->json($sociedades);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'codigo_postal' => 'nullable|string|max:10',
            'poblacion' => 'nullable|string|max:255',
            'tipo_sociedad' => 'nullable|string|max:255',
            'nivel_sociedad' => 'nullable|integer',
            'sociedad_padre_id' => 'nullable|string|max:255|exists:sociedades,id',
        ]);

        $sociedad = Sociedad::create($request->all());

        return response()->json($sociedad, 201);
    }

    public function show($id)
    {
        $sociedad = Sociedad::findOrFail($id);
        return response()->json($sociedad);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'nombre' => 'string|max:255',
            'codigo_postal' => 'nullable|string|max:10',
            'poblacion' => 'nullable|string|max:255',
            'tipo_sociedad' => 'nullable|string|max:255',
            'nivel_sociedad' => 'nullable|integer',
            'sociedad_padre_id' => 'nullable|string|max:255|exists:sociedades,id',
        ]);

        $sociedad = Sociedad::findOrFail($id);
        $sociedad->update($request->all());

        return response()->json($sociedad);
    }

    public function destroy($id)
    {
        $sociedad = Sociedad::findOrFail($id);
        $sociedad->delete();

        return response()->json(null, 204);
    }
}
