<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tipo_producto_sociedad', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('id_sociedad');
            $table->string('id_tipo_producto');
            $table->foreign('id_sociedad')->references('id')->on('sociedad')->onDelete('cascade');
            $table->foreign('id_tipo_producto')->references('id')->on('tipo_producto')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tipo_producto_sociedad');
    }
};
