<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('campos', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('nombre');
            $table->string('tipo_producto_id')->nullable();
            $table->boolean('visible');
            $table->boolean('obligatorio');
            $table->boolean('aparece_formulario');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('campos');
    }
};
