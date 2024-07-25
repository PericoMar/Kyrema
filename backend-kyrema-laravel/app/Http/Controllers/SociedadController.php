<?php

namespace App\Http\Controllers;

use App\Models\Sociedad;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Carbon\Carbon;

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
            'cif' => 'nullable|string|max:255',
            'correo_electronico' => 'required|string|email|max:255',
            'tipo_sociedad' => 'required|string|max:255',
            'direccion' => 'nullable|string|max:255',
            'poblacion' => 'nullable|string|max:255',
            'pais' => 'nullable|string|max:255',
            'codigo_postal' => 'nullable|string|max:10',
            'codigo_sociedad' => 'nullable|string|max:255',
            'telefono' => 'nullable|string|max:20',
            'fax' => 'nullable|string|max:20',
            'movil' => 'nullable|string|max:20',
            'iban' => 'nullable|string|max:34',
            'banco' => 'nullable|string|max:255',
            'sucursal' => 'nullable|string|max:255',
            'dc' => 'nullable|string|max:2',
            'numero_cuenta' => 'nullable|string|max:20',
            'swift' => 'nullable|string|max:11',
            'dominio' => 'nullable|string|max:255',
            'observaciones' => 'nullable|string|max:255',
            'logo' => 'nullable|string|max:255',
            'sociedad_padre_id' => 'nullable|numeric|exists:sociedad,id',
        ]);

        $sociedad = Sociedad::create($request->all());


        return response()->json($sociedad, 201);
    }

    public function getSociedadesHijas($id)
    {
        $sociedad = Sociedad::findOrFail($id); // Obtener la sociedad inicial
        $sociedadesHijas = $sociedad->getSociedadesHijasRecursivo($id);

        $sociedadesCompletas = array_merge([$sociedad], $sociedadesHijas);

        return response()->json($sociedadesCompletas);
    }

    public function show($id)
    {
        $sociedad = Sociedad::findOrFail($id);
        
        // Convertir el logo binario a Base64
        if ($sociedad->logo) {
            $sociedad->logo = base64_encode($sociedad->logo);
        }

        return response()->json($sociedad);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'nombre' => 'string|max:255',
            'cif' => 'nullable|string|max:255',
            'correo_electronico' => 'string|email|max:255',
            'tipo_sociedad' => 'string|max:255',
            'direccion' => 'nullable|string|max:255',
            'poblacion' => 'nullable|string|max:255',
            'pais' => 'nullable|string|max:255',
            'codigo_postal' => 'nullable|string|max:10',
            'codigo_sociedad' => 'nullable|string|max:255',
            'telefono' => 'nullable|string|max:20',
            'fax' => 'nullable|string|max:20',
            'movil' => 'nullable|string|max:20',
            'iban' => 'nullable|string|max:34',
            'banco' => 'nullable|string|max:255',
            'sucursal' => 'nullable|string|max:255',
            'dc' => 'nullable|string|max:2',
            'numero_cuenta' => 'nullable|string|max:20',
            'swift' => 'nullable|string|max:11',
            'dominio' => 'nullable|string|max:255',
            'observaciones' => 'nullable|string|max:255',
            'logo' => 'nullable|string|max:255',
            'sociedad_padre_id' => 'nullable|numeric|exists:sociedad,id',
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
