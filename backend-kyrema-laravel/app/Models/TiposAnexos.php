<?php

// app/Models/TiposAnexos.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TiposAnexos extends Model
{
    protected $table = 'tipos_anexos';
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'id',
        'nombre',
        'id_familia',
    ];

    public function camposAnexos()
    {
        return $this->hasMany(CamposAnexos::class, 'tipo_anexo', 'id');
    }
}
