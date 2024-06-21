<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cp_familia', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('id_familia');
            $table->boolean('vetado');
            $table->string('cp');
            $table->foreign('id_familia')->references('id')->on('tipos_anexos')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cp_familia');
    }
};
