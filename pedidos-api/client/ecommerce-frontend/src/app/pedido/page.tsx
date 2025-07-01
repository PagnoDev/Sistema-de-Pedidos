"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, Thead, TBody, TR, TH, TD } from "@/components/ui/table";
import Link from "next/link";
import { AxiosError } from "axios";
import useSWR from "swr";
import { Produto } from "@/types/Produtos";
import { StatusPedido } from "@/types/enum/StatusPedido";
import { RequestPedidos } from "@/types/RequestPedidos";
import qs from "qs";
import { Pedido } from "@/types/Pedido";
import { useRouter } from "next/navigation";

const fetcherProdutos = (url: string) =>
  fetch(url).then((res) => res.json() as Promise<Produto[]>);

const fetcherPedidos = (url: string) =>
  fetch(url).then((res) => res.json().then() as Promise<Pedido[]>);

export default function PaginaPedidos() {
  const [filtros, setFiltros] = useState({
    id_usuario: "",
    status: "",
    orderBy: "data_pedido",
    order: "desc",
  });

  const [paginaAtual, setPaginaAtual] = useState(1);

  const atualizarFiltro = (campo: string, valor: string) => {
    setFiltros((prev) => ({ ...prev, [campo]: valor }));
  };

  const query = qs.stringify({
    page: paginaAtual,
    orderBy: filtros.orderBy,
    order: filtros.order,
    status: filtros.status || undefined,
    id_usuario: filtros.id_usuario || undefined,
  }, { addQueryPrefix: true });


  const { data: responsePedidos, error: erroPedidos, isLoading: isLoadingPedidos } = useSWR(
    `/api/pedidos/list${query}`,
    fetcherPedidos,
  );

  const [mensagem, setMensagem] = useState("");
  const [itens, setItens] = useState([
    { id_produto: "", quantidade: 1 }
  ]);

  const { data: produtos, error: erroProdutos, isLoading: isLoadingProdutos } = useSWR(
    "/api/produtos/list",
    fetcherProdutos
  );

  const adicionarItem = () => {
    setItens([...itens, { id_produto: "", quantidade: 1 }]);
  };

  const removerItem = (index: number) => {
    const novosItens = [...itens];
    novosItens.splice(index, 1);
    setItens(novosItens);
  };

  const atualizarItem = (index: number, campo: string, valor: string | number) => {
    const novosItens = [...itens];
    // @ts-ignore
    novosItens[index][campo] = valor;
    setItens(novosItens);
  };

  const realizarPedido = async () => {
    try {
      const itensValidos = itens
        .filter((item) => item.id_produto && item.quantidade > 0)
        .map((item) => ({
          id_produto: Number(item.id_produto),
          quantidade: Number(item.quantidade),
        }));

      if (itensValidos.length === 0) {
        setMensagem("Preencha todos os campos.");
        return;
      }

      const response = await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itens: itensValidos }),
      });

      const json = await response.json();

      if (!response.ok) {
        const msg = json.erro || json.message || "Erro ao realizar pedido.";
        setMensagem(`❌ ${msg}`);
        return;
      }

      setMensagem("✅ Pedido realizado com sucesso!");
      setItens([{ id_produto: "", quantidade: 1 }]);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const msg =
        error.response?.data?.message || "Erro ao realizar pedido.";
      setMensagem(msg);
    }
  };

  const router = useRouter();
  const handleLogout = async () => {
    await fetch("/api/login", {
      method: "DELETE", // ou POST se preferir
    });

    router.push("/login"); // Redireciona após logout
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* NAVBAR */}
      <header className="w-full bg-white shadow p-4 text-center font-bold text-xl">
        NAVBAR
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        {/* FORMULÁRIO DE PEDIDOS */}
        <section className="space-y-4">
          <div className="flex justify-between gap-2">
            <Button variant="outline"
              onClick={adicionarItem}
              className="mb-4 text-blue-600 hover:underline"
              type="button">ADD +</Button>
            <Button className="flex-1" onClick={realizarPedido}>ENVIAR PEDIDO</Button>
            <Button
              className="ml-auto bg-red-600 hover:bg-red-700 text-white"
              onClick={handleLogout}
            >
              Sair
            </Button>
          </div>

          {itens.map((item, index) => (
            <div key={index} className="flex gap-2 mb-4 items-end">
              <div className="flex-1">
                <label className="block text-sm">Produto</label>
                {isLoadingProdutos ? (
                  <p>Carregando produtos...</p>
                ) : erroProdutos ? (
                  <p className="text-red-600">Erro ao carregar produtos.</p>
                ) : (
                  <select
                    className="w-full border p-2 rounded"
                    value={item.id_produto}
                    onChange={(e) =>
                      atualizarItem(index, "id_produto", Number(e.target.value))
                    }
                  >
                    <option value="">Selecione um produto</option>

                    {Array.isArray(produtos) &&
                      [...produtos]
                        .sort((a, b) => a.nome.localeCompare(b.nome))
                        .map((produto) => (
                          <option
                            key={produto.id}
                            value={produto.id}
                            disabled={produto.quantidade_estoque! <= 0}
                          >
                            {produto.nome} {produto.quantidade_estoque! <= 0 ? "(Sem estoque)" : ""}
                          </option>
                        ))}
                  </select>
                )}
              </div>

              <div className="w-32">
                <label className="block text-sm">Qtd</label>
                <input
                  type="number"
                  className="w-full border p-2 rounded"
                  value={item.quantidade}
                  onChange={(e) =>
                    atualizarItem(index, "quantidade", Number(e.target.value))
                  }
                />
              </div>

              <button
                onClick={() => removerItem(index)}
                className="text-red-600 hover:underline"
                type="button"
              >
                Remover
              </button>
            </div>
          ))}
          {mensagem && <p className="mt-4 text-green-600">{mensagem}</p>}
        </section>

        {/* LISTAGEM DE PEDIDOS */}
        <section className="bg-white shadow p-4 rounded">
          <h2 className="text-center text-xl font-bold mb-4">PEDIDOS</h2>

          {/* FILTROS */}
          <div className="flex flex-wrap gap-2 mb-2">
            <Input
              placeholder="Filtrar por id do usuário"
              value={filtros.id_usuario}
              onChange={(e) => atualizarFiltro("id_usuario", e.target.value)}
            />
            <select
              value={filtros.status}
              onChange={(e) => atualizarFiltro("status", e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">Todos</option>
              {Object.values(StatusPedido).map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
            <select
              value={filtros.orderBy}
              onChange={(e) => atualizarFiltro("orderBy", e.target.value)}
              className="border rounded p-2"
            >
              <option value="data_pedido">Data</option>
              <option value="total_valor">Total</option>
            </select>
            <select
              value={filtros.order}
              onChange={(e) => atualizarFiltro("direction", e.target.value)}
              className="border rounded p-2"
            >
              <option value="asc">Ascendente</option>
              <option value="desc">Descendente</option>
            </select>
          </div>

          {/* TABELA */}
          <div className="overflow-x-auto">
            <Table>
              <Thead>
                <TR>
                  <TH>ID Usuário</TH>
                  <TH>Data</TH>
                  <TH>Total</TH>
                  <TH>Status</TH>
                  <TH>Ações</TH>
                </TR>
              </Thead>
              <TBody>
                {erroPedidos ? (
                  <TR>
                    <td colSpan={5} className="text-red-600 text-center">
                      Erro ao carregar pedidos.
                    </td>
                  </TR>
                ) : isLoadingPedidos ? (
                  <TR>
                    <td colSpan={5} className="text-center">Carregando pedidos...</td>
                  </TR>
                ) : !Array.isArray(responsePedidos!) || responsePedidos!.length === 0 ? (
                  <TR>
                    <td colSpan={5} className="text-center">Nenhum pedido encontrado.</td>
                  </TR>
                ) : (
                  responsePedidos!.map((pedido: any) => (
                    <TR key={pedido.id}>
                      <TD>{pedido.id_usuario}</TD>
                      <TD>{pedido.data_pedido}</TD>
                      <TD>R$ {Number(pedido.total_valor).toFixed(2)}</TD>
                      <TD>{pedido.status}</TD>
                      <TD>
                        <Link href={`/pedido/${pedido.id}`}>+</Link>
                      </TD>
                    </TR>
                  ))
                )}
              </TBody>
            </Table>
          </div>

          {/* PAGINAÇÃO - Não finalizada */}
          {/* <div className="flex justify-between items-center mt-4">
            <div>Página: {paginaAtual}</div>
            <div className="flex gap-1">
              {Array.from({ length: responsePedidos?. || 1 }, (_, i) => (
                <button
                  key={i}
                  className={`px-2 py-1 rounded ${paginaAtual === i + 1 ? "bg-black text-white" : "bg-gray-200"}`}
                  onClick={() => setPaginaAtual(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button className="px-2 py-1 bg-gray-300 rounded">Mais</button>
            </div>
          </div> */}
        </section>
      </div>
    </div>
  );
}
