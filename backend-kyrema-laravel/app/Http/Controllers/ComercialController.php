<?php

namespace App\Http\Controllers;

use App\Models\Comercial;
use Illuminate\Http\Request;

class ComercialController extends Controller
{
    public function index()
    {
        $comerciales = Comercial::all();
        return response()->json($comerciales);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'id_sociedad' => 'required|string|max:255|exists:sociedades,id',
            'usuario' => 'required|string|max:255',
            'contraseña' => 'required|string|max:255',
        ]);

        $comercial = Comercial::create($request->all());

        return response()->json($comercial, 201);
    }

    public function getComercialesPorSociedad($sociedad)
    {
        $comerciales = Comercial::where('sociedad_id', $sociedad)->get();
        return response()->json($comerciales);
    }

    public function show($id)
    {
        $comercial = Comercial::findOrFail($id);
        return response()->json($comercial);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'nombre' => 'string|max:255',
            'id_sociedad' => 'string|max:255|exists:sociedades,id',
            'usuario' => 'string|max:255',
            'contraseña' => 'string|max:255',
        ]);

        $comercial = Comercial::findOrFail($id);
        $comercial->update($request->all());

        return response()->json($comercial);
    }

    public function destroy($id)
    {
        $comercial = Comercial::findOrFail($id);
        $comercial->delete();

        return response()->json(null, 204);
    }
}
