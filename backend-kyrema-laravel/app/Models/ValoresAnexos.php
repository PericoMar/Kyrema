<?php

// app/Models/ValoresAnexos.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ValoresAnexos extends Model
{
    protected $table = 'valores_anexos';
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'id',
        'campo_id',
        'valor',
        'producto',
    ];

    public function campo()
    {
        return $this->belongsTo(Campos::class, 'campo_id', 'id');
    }
}
