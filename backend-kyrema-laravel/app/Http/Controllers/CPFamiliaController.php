<?php

namespace App\Http\Controllers;

use App\Models\CPFamilia;
use Illuminate\Http\Request;

class CPFamiliaController extends Controller
{
    public function index()
    {
        $cpfFamilias = CPFamilia::all();
        return response()->json($cpfFamilias);
    }

    public function store(Request $request)
    {
        $request->validate([
            'id_familia' => 'required|string|max:255|exists:tipo_anexos,id',
            'vetado' => 'required|boolean',
            'cp' => 'required|string|max:10',
        ]);

        $cpfFamilia = CPFamilia::create($request->all());

        return response()->json($cpfFamilia, 201);
    }

    public function show($id)
    {
        $cpfFamilia = CPFamilia::findOrFail($id);
        return response()->json($cpfFamilia);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'id_familia' => 'string|max:255|exists:tipo_anexos,id',
            'vetado' => 'boolean',
            'cp' => 'string|max:10',
        ]);

        $cpfFamilia = CPFamilia::findOrFail($id);
        $cpfFamilia->update($request->all());

        return response()->json($cpfFamilia);
    }

    public function destroy($id)
    {
        $cpfFamilia = CPFamilia::findOrFail($id);
        $cpfFamilia->delete();

        return response()->json(null, 204);
    }
}
