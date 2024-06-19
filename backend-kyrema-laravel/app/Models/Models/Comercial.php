<?php

// app/Models/Comercial.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comercial extends Model
{
    protected $table = 'comercial';
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'id',
        'nombre',
        'id_sociedad',
        'usuario',
        'contraseña',
    ];

    public function sociedad()
    {
        return $this->belongsTo(Sociedad::class, 'id_sociedad', 'id');
    }

    public function comisiones()
    {
        return $this->hasMany(ComercialComision::class, 'id_comercial', 'id');
    }
}

