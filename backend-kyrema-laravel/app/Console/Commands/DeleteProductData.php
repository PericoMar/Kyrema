<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class DeleteProductData extends Command
{
    protected $signature = 'delete:product-data {productId}';
    protected $description = 'Deletes product data from various tables';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        $productId = $this->argument('productId');

        // Delete from tipo_producto
        DB::table('tipo_producto')->where('id', $productId)->delete();

        // Delete from tipo_producto_sociedad
        DB::table('tipo_producto_sociedad')->where('id_tipo_producto', $productId)->delete();

        // Delete from tarifas_producto
        DB::table('tarifas_producto')->where('tipo_producto_id', $productId)->delete();

        //Coger las letrasIdentificacion de la tabla tipo_producto
        $letrasIdentificacion = DB::table('tipo_producto')->where('id', $productId)->pluck('letras_identificacion');

        if (Schema::hasTable($letrasIdentificacion)) {
            Schema::dropIfExists($letrasIdentificacion);
        }

        // Delete from campos
        DB::table('campos')->where('tipo_producto_id', $productId)->delete();

        $this->info("Data for product ID $productId has been deleted.");
    }
}
