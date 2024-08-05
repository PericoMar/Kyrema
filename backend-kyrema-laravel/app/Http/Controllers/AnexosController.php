<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TiposAnexos;
use App\Models\TipoProductoSociedad;

class AnexosController extends Controller
{
    public function getAnexosPorSociedad($id_sociedad){
        //Cogemos todos los tipos_productos asociados a esta sociedad:
        $tiposProductoSociedad = TipoProductoSociedad::where('id_sociedad', $id_sociedad)->get();
        $tiposProductoSociedadIds = $tiposProductoSociedad->pluck('id');

        //Cogemos todos los tipos_anexo asociados a estos tipos_productos:
        $tiposAnexo = TiposAnexos::whereIn('id_tipo_producto', $tiposProductoSociedadIds)->get();

        return response()->json($tiposAnexo);
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
