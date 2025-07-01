<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Produto extends Model
{
    protected $fillable = [
        'nome',
        'quantidade_estoque',
    ];

    public function itensPedido()
    {
        return $this->hasMany(ItemPedido::class, 'id_produto');
    }
}
