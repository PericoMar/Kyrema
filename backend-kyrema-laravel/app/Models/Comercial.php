<?php

// app/Models/Comercial.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class Comercial extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable;

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

    public static function create(array $data)
    {
        $comercial = new static();

        $comercial->fill($data);
        $comercial->save();

        return $comercial;
    }

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }
}

