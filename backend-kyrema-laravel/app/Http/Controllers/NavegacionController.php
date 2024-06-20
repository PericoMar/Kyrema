<?php

namespace App\Http\Controllers;

use App\Models\Navegacion;
use Illuminate\Http\Request;

class NavegacionController extends Controller
{
    /**
     * Display a listing of the resource by level.
     *
     * @param int $nivel
     * @return \Illuminate\Http\Response
     */
    public function getByLevel($nivel)
    {
        $navegaciones = Navegacion::where('nivel', $nivel)->get();
        return response()->json($navegaciones);
    }

    
    public function index()
    {
        $navegaciones = Navegacion::all();
        return response()->json($navegaciones);
    }

    public function store(Request $request)
    {
        $request->validate([
            'navegacion' => 'required|string|max:255',
            'navegacion_padre_id' => 'nullable|string|max:255|exists:navegacions,id',
            'ruta' => 'nullable|string|max:255',
            'nivel' => 'nullable|integer',
        ]);

        $navegacion = Navegacion::create($request->all());

        return response()->json($navegacion, 201);
    }

    public function show($id)
    {
        $navegacion = Navegacion::findOrFail($id);
        return response()->json($navegacion);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'navegacion' => 'string|max:255',
            'navegacion_padre_id' => 'nullable|string|max:255|exists:navegacions,id',
            'ruta' => 'nullable|string|max:255',
            'nivel' => 'nullable|integer',
        ]);

        $navegacion = Navegacion::findOrFail($id);
        $navegacion->update($request->all());

        return response()->json($navegacion);
    }

    public function destroy($id)
    {
        $navegacion = Navegacion::findOrFail($id);
        $navegacion->delete();

        return response()->json(null, 204);
    }
}
