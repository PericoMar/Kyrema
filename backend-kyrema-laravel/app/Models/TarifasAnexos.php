<?php

// app/Models/TarifasAnexos.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TarifasAnexos extends Model
{
    protected $table = 'tarifas_anexos';
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'id',
        'anexo',
        'tiene_escala',
        'id_producto',
        'precio',
    ];

    public function tipoAnexo()
    {
        return $this->belongsTo(TiposAnexos::class, 'anexo', 'id');
    }

    public function escaladosAnexo()
    {
        return $this->hasMany(EscaladoAnexo::class, 'anexo_id', 'anexo');
    }
}
