<?php

namespace App\Http\Controllers;

use App\Models\Navegacion;
use Illuminate\Http\Request;

class NavegacionController extends Controller
{
    /**
     * Obtener la navegación para un nivel de comercial específico.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getNavegacion(Request $request)
    {
        $nivel = $request->input('nivel');
        
        // Obtener todas las navegaciones de nivel dado
        $navegacionesPadres = Navegacion::where('nivel', $nivel)
            ->whereNull('navegacion_padre_id')
            ->get();
        
        // Transformar los datos al formato deseado
        $formattedNav = $navegacionesPadres->map(function ($navegacion) {
            return $this->transformNavegacion($navegacion);
        });

        return response()->json($formattedNav);
    }

    /**
     * Transformar la navegación en el formato deseado.
     *
     * @param  \App\Models\Navegacion  $navegacion
     * @return array
     */
    private function transformNavegacion($navegacion)
    {
        // Obtener los hijos del padre actual
        $children = Navegacion::where('navegacion_padre_id', $navegacion->id)->get();

        return [
            'label' => $navegacion->navegacion,
            'children' => $children->map(function ($child) {
                return [
                    'label' => $child->navegacion,
                    'link' => $child->ruta,
                ];
            })->toArray()
        ];
    }
}
