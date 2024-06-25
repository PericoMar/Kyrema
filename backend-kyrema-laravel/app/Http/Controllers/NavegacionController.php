<?php

namespace App\Http\Controllers;

use App\Models\Navegacion;
use Illuminate\Http\Request;

class NavegacionController extends Controller
{
    public function index(Request $request, $nivel)
    {
        // Obtener los elementos de navegación de nivel específico
        $navegacion = Navegacion::where('nivel', $nivel)
            ->whereNull('navegacion_padre_id') // Filtrar solo los elementos padre
            ->with('children') // Cargar los hijos de navegación
            ->get();

        // Recorrer los elementos padre y cargar sus hijos de manera recursiva
        $navegacionConHijos = $navegacion->map(function ($item) {
            return $this->cargarHijos($item);
        });

        return response()->json($navegacionConHijos);
    }

    private function cargarHijos($item)
    {
        $item->load('children'); // Cargar los hijos de navegación

        // Si tiene hijos, recorrer recursivamente para cargar sus hijos
        if ($item->children) {
            $item->children->each(function ($child) {
                $this->cargarHijos($child);
            });
        }

        return $item;
    }
}
