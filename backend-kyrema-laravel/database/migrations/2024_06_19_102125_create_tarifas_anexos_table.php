<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tarifas_anexos', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('anexo');
            $table->boolean('tiene_escala');
            $table->string('id_producto');
            $table->decimal('precio', 10, 2);
            $table->foreign('id_producto')->references('id')->on('tarifas_producto')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tarifas_anexos');
    }
};
