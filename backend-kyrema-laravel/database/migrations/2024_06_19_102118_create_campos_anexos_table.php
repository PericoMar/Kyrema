<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('campos_anexos', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('campo_id');
            $table->string('tipo_anexo');
            $table->boolean('obligatorio');
            $table->foreign('campo_id')->references('id')->on('campos')->onDelete('cascade');
            $table->foreign('tipo_anexo')->references('id')->on('tipos_anexos')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('campos_anexos');
    }
};

