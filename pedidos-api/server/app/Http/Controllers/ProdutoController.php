<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ProdutoController extends Controller
{
    public function nomeId()
    {
        return \App\Models\Produto::select('id', 'nome', 'quantidade_estoque')->get();
    }
}
