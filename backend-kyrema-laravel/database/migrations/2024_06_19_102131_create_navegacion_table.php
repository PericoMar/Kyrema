<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('navegacion', function (Blueprint $table) {
            $table->id(); // Utilizamos el helper 'id()' para definir una clave primaria autoincremental
            $table->string('navegacion');
            $table->unsignedBigInteger('navegacion_padre_id')->nullable(); // Cambiamos a unsignedBigInteger
            $table->string('ruta')->nullable();
            $table->integer('nivel');
            $table->timestamps();

            // Definir la restricción de clave externa después de la creación de la tabla
            $table->foreign('navegacion_padre_id')
                  ->references('id')
                  ->on('navegacion')
                  ->onDelete('no action'); // Evitar ciclos usando 'no action'
        });
    }

    public function down()
    {
        Schema::dropIfExists('navegacion');
    }
};
