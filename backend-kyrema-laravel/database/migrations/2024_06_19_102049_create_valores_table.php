<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('valores', function (Blueprint $table) {
            $table->string('campo_id');
            $table->string('valor');
            $table->string('producto_id');
            $table->primary(['campo_id', 'producto_id']);
            $table->foreign('campo_id')->references('id')->on('campos')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('valores');
    }
};

