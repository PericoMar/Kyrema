<?php

// app/Models/Campos.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Campos extends Model
{
    protected $table = 'campos';
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'id',
        'nombre',
        'tipo_producto_id',
        'visible',
        'obligatorio',
        'aparece_formulario',
    ];

    public function tipoProducto()
    {
        return $this->belongsTo(TipoProducto::class, 'tipo_producto_id', 'id');
    }

    public function valores()
    {
        return $this->hasMany(Valores::class, 'campo_id', 'id');
    }
}
