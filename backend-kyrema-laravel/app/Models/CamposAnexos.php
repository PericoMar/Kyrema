<?php

// app/Models/CamposAnexos.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CamposAnexos extends Model
{
    protected $table = 'campos_anexos';
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'id',
        'campo_id',
        'tipo_anexo',
        'obligatorio',
    ];

    public function tipoAnexo()
    {
        return $this->belongsTo(TiposAnexos::class, 'tipo_anexo', 'id');
    }
}
