<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('comercial', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('nombre');
            $table->string('id_sociedad');
            $table->string('usuario');
            $table->string('contraseña');
            $table->foreign('id_sociedad')->references('id')->on('sociedad')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('comercial');
    }
};
