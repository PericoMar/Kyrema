<?php

namespace App\Http\Controllers;

use App\Models\TipoProducto;
use Illuminate\Http\Request;
use App\Models\TipoProductoSociedad;

class NavController extends Controller
{   
    const SOCIEDAD_ADMIN_ID = 1;
    // Para coger las distintas rutas de la aplicación
    public function getNavegacion($id_sociedad){
        // Coger los tipos de producto asociados con la sociedad
        $tipoProductoIds = TipoProductoSociedad::where('id_sociedad', $id_sociedad)->pluck('id_tipo_producto');

        // Coger los tipos de producto basados en los IDs obtenidos
        $tiposProducto = TipoProducto::whereIn('id', $tipoProductoIds)->get();

        //Devolver la navegación con el siguiente formato:
        
        // [
        //     {
        //         "label": "Administración",
        //         "children": [
        //             {
        //                 "label": "Informes seguros combinados",
        //                 "link": "/informes/sc"
        //             },
        //             {
        //                 "label": "Informes seguros eventos",
        //                 "link": "/informes/se"
        //             },
        //          ]
        //     },
        //     {
        //         "label": "Gestión",
        //         "children": [
        //             {
        //                 "label": "Sociedades",
        //                 "link": "/sociedades"
        //             },
        //             {
        //                 "label": "Tarifas",
        //                 "link": "/tarifas"
        //             },
        //             {
        //                 "label": "Comisiones",
        //                 "link": "/comisiones"
        //             },
        //             {
        //                 "label": "Productos",
        //                 "link": "/gestion-productos"
        //             }
        //         ]
        //     },
        //     {
        //         "label": "Productos",
        //         "children": [
        //             {
        //                 "label": "Seguros combinados",
        //                 "link": "/operaciones/sc"
        //             },
        //             {
        //                 "label": "Seguros eventos",
        //                 "link": "/operaciones/se"
        //             },
        //         ]
        //     }
        // ]

        $navegacion = [];
        $navegacion[] = [
            "label" => "Administración",
            "children" => []
        ];
        $navegacion[] = [
            "label" => "Gestión",
            "children" => []
        ];
        $navegacion[] = [
            "label" => "Productos",
            "children" => []
        ];


        $navegacion[0]["children"] = $tiposProducto->map(function($tipoProducto){
            return [
                "label" => "Informes " . $tipoProducto->nombre,
                "link" => "/informes/" . $tipoProducto->letras_identificacion
            ];
        })->toArray();
        $navegacion[1]["children"] = [
            [
                "label" => "Sociedades",
                "link" => "/sociedades"
            ],
            [
                "label" => "Tarifas",
                "link" => "/tarifas"
            ],
            [
                "label" => "Comisiones",
                "link" => "/comisiones"
            ],
            [
                "label" => "Productos",
                "link" => "/gestion-productos"
            ]
        ];
        $navegacion[2]["children"] = $tiposProducto->map(function($tipoProducto){
            return [
                "label" => "Seguros " . $tipoProducto->nombre,
                "link" => "/operaciones/" . $tipoProducto->letras_identificacion
            ];
        })->toArray();
        // La parte de gestion solo si el id es el mismo que la sociedad admin, despues coger tipos producto y en Administracion coger los nombres
        // y concatenarlos con Informes y en link meter /informes/:letrasIdentificacion, En Productos en el label el nombre directamente y en el link /operaciones/:letrasIdentificacion
        if($id_sociedad != self::SOCIEDAD_ADMIN_ID){
            // Borrar la parte de gestion:
            unset($navegacion[1]);
        }

        return response()->json($navegacion);
    }
}
