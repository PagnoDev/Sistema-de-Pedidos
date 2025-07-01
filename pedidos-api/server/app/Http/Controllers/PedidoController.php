<?php

namespace App\Http\Controllers;

use App\Models\Pedido;
use App\Models\Produto;
use App\Models\ItemPedido;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;

class PedidoController extends Controller
{
    public function index(Request $request)
    {
        $query = Pedido::with('user', 'itens.produto');

        // Filtro por status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filtro por usuário
        if ($request->has('id_usuario')) {
            $query->where('id_usuario', $request->id_usuario);
        }

        // Ordenação
        $sortField = $request->get('order_by', 'data_pedido');
        $sortDirection = $request->get('order', 'asc');

        if (in_array($sortField, ['data_pedido', 'total_valor']) && in_array($sortDirection, ['asc', 'desc'])) {
            $query->orderBy($sortField, $sortDirection);
        }

        return $query->get();
    }

    public function show($id)
    {
        $pedido = Pedido::with('user', 'itens.produto')->findOrFail($id);
        return response()->json($pedido);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id_usuario' => 'required|exists:users,id',
            'itens' => 'required|array|min:1',
            'itens.*.id_produto' => 'required|exists:produtos,id',
            'itens.*.quantidade' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Erro de validação',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();

        return DB::transaction(function () use ($data) {
            $total = 0;
            $itensPreparados = [];
            $http = new Client();

            foreach ($data['itens'] as $item) {
                try {
                    $response = $http->post('http://localhost:3000/webhook/atualizar-estoque', [
                        'json' => [
                            'id_produto' => $item['id_produto'],
                            'quantidade' => $item['quantidade'],
                        ]
                    ]);

                    $statusCode = $response->getStatusCode();
                    $body = json_decode($response->getBody(), true);

                    if ($statusCode !== 200) {
                        return response()->json($body, $statusCode);
                    }
                } catch (RequestException $e) {
                    $errorResponse = $e->getResponse();
                    $erro = 'Erro de comunicação com o webhook.';
                    if ($errorResponse) {
                        $body = json_decode($errorResponse->getBody(), true);
                        $erro = $body['erro'] ?? $erro;
                    }
                    abort(422, $erro);
                }

                // Produto e preço fictício (pode ser substituído por dados reais)
                $produto = Produto::find($item['id_produto']);
                $preco = fake()->randomFloat(2, 10, 500);
                $subtotal = $item['quantidade'] * $preco;
                $total += $subtotal;

                $itensPreparados[] = [
                    'produto' => $produto,
                    'quantidade' => $item['quantidade'],
                    'preco' => $preco
                ];
            }

            $pedido = Pedido::create([
                'id' => Str::uuid(),
                'id_usuario' => $data['id_usuario'],
                'status' => 'pendente',
                'total_valor' => $total,
                'data_pedido' => now(),
            ]);

            foreach ($itensPreparados as $item) {
                ItemPedido::create([
                    'id_pedido' => $pedido->id,
                    'id_produto' => $item['produto']->id,
                    'quantidade' => $item['quantidade'],
                    'preco_unitario_no_momento_da_compra' => $item['preco'],
                ]);
            }

            return response()->json($pedido->load('itens.produto'), 201);
        });
    }

    public function atualizarStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pendente,processando,enviado,entregue,cancelado',
        ]);

        $pedido = Pedido::findOrFail($id);

        $statusAtual = $pedido->status;
        $statusNovo = $request->status;

        $transicoesValidas = [
            'pendente'     => ['processando', 'cancelado'],
            'processando'  => ['enviado', 'cancelado'],
            'enviado'      => ['entregue'],
            'entregue'     => [],
            'cancelado'    => [],
        ];

        if (!in_array($statusNovo, $transicoesValidas[$statusAtual])) {
            return response()->json([
                'message' => "Transição inválida de status.",
                'status_atual' => $statusAtual,
                'tentando_ir_para' => $statusNovo,
                'permitidos' => $transicoesValidas[$statusAtual],
            ], 422);
        }

        $pedido->status = $statusNovo;
        $pedido->save();

        return response()->json([
            'message' => 'Status atualizado com sucesso.',
            'pedido' => $pedido
        ]);
    }
}
