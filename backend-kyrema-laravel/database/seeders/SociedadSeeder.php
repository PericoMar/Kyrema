<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Sociedad;

class SociedadSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Sociedad::create([
            'id' => '1',
            'nombre' => 'Sociedad Admin',
            'codigo_postal' => '41940',
            'poblacion' => 'Sevilla',
            'tipo_sociedad' => 'Pruebas',
            'nivel_sociedad' => 1,
            'sociedad_padre_id' => null, // Opcional: Si tiene sociedad padre, cambia esto
        ]);

        // Puedes añadir más registros según sea necesario
    }
}
