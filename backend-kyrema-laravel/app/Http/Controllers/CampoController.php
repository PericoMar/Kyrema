<?php

namespace App\Http\Controllers;

use App\Models\Campo;
use Illuminate\Http\Request;

class CampoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $campos = Campo::all();
        return response()->json($campos);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'tipo_producto_id' => 'nullable|string|max:255',
            'visible' => 'required|boolean',
            'obligatorio' => 'required|boolean',
            'aparece_formulario' => 'required|boolean',
        ]);

        $campo = Campo::create($request->all());

        return response()->json($campo, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $campo = Campo::findOrFail($id);
        return response()->json($campo);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'nombre' => 'string|max:255',
            'tipo_producto_id' => 'nullable|string|max:255',
            'visible' => 'boolean',
            'obligatorio' => 'boolean',
            'aparece_formulario' => 'boolean',
        ]);

        $campo = Campo::findOrFail($id);
        $campo->update($request->all());

        return response()->json($campo);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $campo = Campo::findOrFail($id);
        $campo->delete();

        return response()->json(null, 204);
    }
}

