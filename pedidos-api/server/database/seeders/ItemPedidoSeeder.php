<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use app\Models\Pedido;
use App\Models\Produto;
use App\Models\ItemPedido;

class ItemPedidoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $pedidos = Pedido::all();
        $produtos = Produto::all();

        foreach ($pedidos as $pedido) {
            if (!$pedido->id || $pedido->id === 0) continue;

            $itens = $produtos->random(rand(5, 10));

            foreach ($itens as $produto) {
                $quantidade = rand(1, 5);
                $preco = rand(1000, 50000) / 100; // R$10,00 a R$500,00
                $subtotal = $quantidade * $preco;

                ItemPedido::create([
                    'id_pedido' => $pedido->id,
                    'id_produto' => $produto->id,
                    'quantidade' => $quantidade,
                    'preco_unitario_no_momento_da_compra' => $preco,
                ]);

                $pedido->total_valor += $subtotal;
            }

            $pedido->save();
        }
    }
}
