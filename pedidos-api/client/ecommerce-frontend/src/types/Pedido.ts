import { StatusPedido } from "./enum/StatusPedido";
import { Produto } from "./Produtos";

export interface Pedido {
    id:number,
    nome: string,
    id_usuario: string,
    quantidade_estoque: string,
    preco: string,
    status: StatusPedido,
    total_valor: string,
    data_pedido:Date,
    itens:{id_produto:number, quantidade:number}[],
}
