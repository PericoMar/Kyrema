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
        
        for ($i = 0; $i < 100; $i++) {
            DB::table('pp')->insert([
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
                'codigo_postal' => $faker->numerify('#####'), // 5 dígitos para el código postal
                'fecha_de_nacimiento' => $faker->date($format = 'Y-m-d', $max = '2000-12-31'),
                'codigo' => $faker->numerify('###'),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);
        }
    }
}
