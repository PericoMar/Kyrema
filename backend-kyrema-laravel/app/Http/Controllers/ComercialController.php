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
            'id_sociedad' => 'required|numeric|exists:sociedad,id',
            'usuario' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'contraseña' => 'required|string|max:255',
            'dni' => 'required|string|max:255',
            'sexo' => 'nullable|string|max:10',
            'fecha_nacimiento' => 'required|date',
            'fecha_alta' => 'nullable|date',
            'referido' => 'nullable|string|max:255',
            'direccion' => 'nullable|string|max:255',
            'poblacion' => 'nullable|string|max:255',
            'provincia' => 'nullable|string|max:255',
            'cod_postal' => 'nullable|string|max:10',
            'telefono' => 'nullable|string|max:20',
            'fax' => 'nullable|string|max:20',
            'path_licencia_cazador' => 'nullable|string|max:255',
            'path_dni' => 'nullable|string|max:255',
            'path_justificante_iban' => 'nullable|string|max:255',
            'path_otros' => 'nullable|string|max:255',
            'path_foto' => 'nullable|string|max:255',
        ]);

        // Cambiar el formato de las fechas 'Y-m-d\TH:i:s'
        if ($request->fecha_nacimiento) {
            $request->fecha_nacimiento = date('Y-m-d\TH:i:s', strtotime($request->fecha_nacimiento));
        }
        if ($request->fecha_alta) {
            $request->fecha_alta = date('Y-m-d\TH:i:s', strtotime($request->fecha_alta));
        }

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
            'id_sociedad' => 'numeric|exists:sociedad,id',
            'usuario' => 'string|max:255',
            'email' => 'string|email|max:255',
            'contraseña' => 'string|max:255',
            'dni' => 'string|max:255',
            'sexo' => 'string|max:10',
            'fecha_nacimiento' => 'date',
            'fecha_alta' => 'date',
            'referido' => 'string|max:255',
            'direccion' => 'string|max:255',
            'poblacion' => 'string|max:255',
            'provincia' => 'string|max:255',
            'cod_postal' => 'string|max:10',
            'telefono' => 'string|max:20',
            'fax' => 'string|max:20',
            'path_licencia_cazador' => 'string|max:255',
            'path_dni' => 'string|max:255',
            'path_justificante_iban' => 'string|max:255',
            'path_otros' => 'string|max:255',
            'path_foto' => 'string|max:255',
        ]);

        // Cambiar el formato de las fechas 'Y-m-d\TH:i:s'
        if ($request->fecha_nacimiento) {
            $request->fecha_nacimiento = date('Y-m-d\TH:i:s', strtotime($request->fecha_nacimiento));
        }
        if ($request->fecha_alta) {
            $request->fecha_alta = date('Y-m-d\TH:i:s', strtotime($request->fecha_alta));
        }

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
