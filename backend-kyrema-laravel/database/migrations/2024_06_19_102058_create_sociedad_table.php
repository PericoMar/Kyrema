<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('sociedad', function (Blueprint $table) {
            $table->id(); // Clave primaria
            $table->string('nombre', 255)->nullable(false);
            $table->string('codigo_postal', 10)->nullable();
            $table->string('codigo_sociedad', 10)->nullable();
            $table->string('poblacion', 255)->nullable();
            $table->string('tipo_sociedad', 255)->nullable();
            $table->integer('nivel_sociedad')->nullable();
            $table->binary('logo')->nullable();
            $table->unsignedBigInteger('sociedad_padre_id')->nullable(); // Clave foránea auto-referencial

            $table->timestamps(); // Añade los campos 'created_at' y 'updated_at'
        });

        // Agregar restricción de clave externa con ON DELETE NO ACTION
        Schema::table('sociedad', function (Blueprint $table) {
            $table->foreign('sociedad_padre_id')
                ->references('id')
                ->on('sociedad')
                ->onDelete('no action');
        });
    }


    public function down()
    {
        Schema::dropIfExists('sociedad');
    }
};
