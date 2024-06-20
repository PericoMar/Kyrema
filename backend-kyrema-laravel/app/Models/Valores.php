<?php

// app/Models/Valores.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Valores extends Model
{
    protected $table = 'valores';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'campo_id',
        'valor',
        'producto_id',
    ];

    public function campo()
    {
        return $this->belongsTo(Campos::class, 'campo_id', 'id');
    }
}

