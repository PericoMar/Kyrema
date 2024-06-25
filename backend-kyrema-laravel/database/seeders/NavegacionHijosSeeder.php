<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Navegacion;

class NavegacionHijosSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         // Nivel 2 - Hijos de Gestión
         $gestion_sociedades = Navegacion::create([
            'navegacion' => 'Sociedades',
            'ruta' => '/sociedades',
            'nivel' => 2,
            'navegacion_padre_id' => 2,
        ]);

        $tarifas = Navegacion::create([
            'navegacion' => 'Tarifas',
            'ruta' => '/tarifas',
            'nivel' => 2,
            'navegacion_padre_id' => 2,
        ]);

        $comisiones = Navegacion::create([
            'navegacion' => 'Comisiones',
            'ruta' => '/comisiones',
            'nivel' => 2,
            'navegacion_padre_id' => 2,
        ]);

        $productos_gestion = Navegacion::create([
            'navegacion' => 'Productos',
            'ruta' => '/gestion-productos',
            'nivel' => 2,
            'navegacion_padre_id' => 2,
        ]);

        // Nivel 3 - Hijos de Productos
        $seguros_combinados = Navegacion::create([
            'navegacion' => 'Seguros Combinados',
            'ruta' => '/operaciones/seguros-combinados',
            'nivel' => 3,
            'navegacion_padre_id' => 3,
        ]);

        $seguros_cacerias = Navegacion::create([
            'navegacion' => 'Seguros de Cacerías',
            'ruta' => '/operaciones/seguros-cacerias',
            'nivel' => 3,
            'navegacion_padre_id' => 3,
        ]);

        $tarjetas_emisoras = Navegacion::create([
            'navegacion' => 'Tarjetas Emisoras',
            'ruta' => '/operaciones/tarjetas-emisoras',
            'nivel' => 3,
            'navegacion_padre_id' => 3,
        ]);

        $seguros_kyrema_naturaleza = Navegacion::create([
            'navegacion' => 'Seguros Kyrema Naturaleza',
            'ruta' => '/operaciones/seguros-kyrema-naturaleza',
            'nivel' => 3,
            'navegacion_padre_id' => 3,
        ]);

        $seguros_extranjeros = Navegacion::create([
            'navegacion' => 'Seguros Extranjeros',
            'ruta' => '/operaciones/seguros-extranjeros',
            'nivel' => 3,
            'navegacion_padre_id' => 3,
        ]);
    }
}
