<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;
use Carbon\Carbon;

class ProductsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $faker = Faker::create();
        
        for ($i = 0; $i < 1000; $i++) { // Cambiado a 1000 para más datos
            $fechaDeNacimiento = $faker->dateTimeBetween('-80 years', '-18 years')->format('Y-m-d');
            $pruebaFecha = $faker->dateTimeBetween('-30 years', 'now')->format('Y-m-d');
            $createdAt = Carbon::now()->toDateTimeString(); // Formato 'Y-m-d H:i:s'
            $updatedAt = Carbon::now()->toDateTimeString(); // Formato 'Y-m-d H:i:s'

            DB::table('tst2')->insert([
                'sociedad_id' => 1,
                'sociedad' => 'Admin',
                'comercial_id' => 1,
                'dni' => $faker->unique()->numerify('########') . strtoupper($faker->randomLetter),
                'nombre_socio' => $faker->firstName,
                'apellido_1' => $faker->lastName,
                'apellido_2' => $faker->lastName,
                'email' => $faker->unique()->safeEmail,
                'telefono' => $faker->phoneNumber,
                'sexo' => $faker->randomElement(['M', 'F']),
                'dirección' => $faker->address,
                'población' => $faker->city,
                'provincia' => $faker->state,
                'codigo_postal' => $faker->numerify('#####'),
                'fecha_de_nacimiento' => $fechaDeNacimiento,
                'prueba_fecha' => $pruebaFecha,
                'created_at' => Carbon::now()->format('Y-m-d\TH:i:s'), // Formato 'Y-m-d\TH:i:s'
                'updated_at' => Carbon::now()->format('Y-m-d\TH:i:s'), // Formato 'Y-m-d\TH:i:s'
            ]);
        }
    }
}
