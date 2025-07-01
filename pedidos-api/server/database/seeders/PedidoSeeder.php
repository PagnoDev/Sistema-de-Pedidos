<?php

namespace Database\Seeders;

use Illuminate\Support\Str;
use Illuminate\Database\Seeder;
use App\Models\Pedido;
use App\Models\User;

class PedidoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();
        foreach ($users as $user) {
            $quantidade_de_pedidos = rand(1, 10);
            for ($i = 0; $i < $quantidade_de_pedidos; $i++) {
                Pedido::create([
                    'id' => Str::uuid(),
                    'id_usuario' => $user->id,
                    'status' => collect(['pendente', 'processando', 'enviado', 'entregue', 'cancelado'])->random(),
                    'total_valor' => 0 // será atualizado no seeder de itens
                ]);
            }
        }
    }
}
