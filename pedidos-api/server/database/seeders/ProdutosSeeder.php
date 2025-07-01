<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Produto;

class ProdutosSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $nomes = [
            'Monitor',
            'Teclado',
            'Mouse',
            'Headset',
            'Notebook',
            'Cadeira',
            'Mesa',
            'Webcam',
            'Microfone',
            'HD Externo',
            'SSD',
            'Placa-mãe',
            'Placa de Vídeo',
            'Fonte',
            'Gabinete',
            'Cooler',
            'Pendrive',
            'Adaptador',
            'Roteador',
            'Estabilizador'
        ];

        foreach ($nomes as $nome) {
            Produto::create([
                'nome' => $nome,
                'quantidade_estoque' => rand(10, 100),
            ]);
        }
    }
}
