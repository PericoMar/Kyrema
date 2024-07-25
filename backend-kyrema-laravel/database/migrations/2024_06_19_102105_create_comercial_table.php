<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('comercial', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->unsignedBigInteger('id_sociedad');
            $table->string('usuario');
            $table->string('email');
            $table->string('contraseña');
            $table->foreign('id_sociedad')->references('id')->on('sociedad')->onDelete('cascade');
            // Además: DNI, Sexo, Fecha de nacimiento, Fecha de alta, Referido, Direccion, Población, Provincia, Cod. Postal , Telefono, Fax, path Licencia de cazador, path_DNI, path justificante IBAN, path_otros
            $table->string('dni');
            $table->string('sexo');
            $table->date('fecha_nacimiento');
            $table->date('fecha_alta');
            $table->string('referido');
            $table->string('direccion');
            $table->string('poblacion');
            $table->string('provincia');
            $table->string('cod_postal');
            $table->string('telefono');
            $table->string('fax');
            $table->string('path_licencia_cazador');
            $table->string('path_dni');
            $table->string('path_justificante_iban');
            $table->string('path_otros');
            $table->string('path_foto');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('comercial');
    }
};
