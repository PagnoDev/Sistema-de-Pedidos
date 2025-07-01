<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PedidoController;
use App\Http\Controllers\ProdutoController;
use App\Http\Controllers\AuthController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware(['auth:api', 'auth'])->group(function () {
    Route::get('/produtos/list', [ProdutoController::class, 'nomeId']);
    Route::get('/pedidos', [PedidoController::class, 'index']); 
    Route::post('/pedidos', [PedidoController::class, 'store']);
    Route::get('/pedidos/{id}', [PedidoController::class, 'show']);
    Route::patch('/pedidos/{id}/status', [PedidoController::class, 'atualizarStatus']);
});
