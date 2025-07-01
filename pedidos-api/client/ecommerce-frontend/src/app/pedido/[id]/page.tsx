"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { Pedido } from "@/types/Pedido";
import { StatusPedido } from "@/types/enum/StatusPedido";

const fetcherPedido = (url: string) =>
    fetch(url).then((res) => res.json() as Promise<Pedido>);

export default function DetalhesPedido() {
    const { id } = useParams() as { id: string };
    const [mensagem, setMensagem] = useState<string>("");
    const [novoStatus, setNovoStatus] = useState<string>("");
    const { data: responsePedido, error: erroPedido, mutate } = useSWR(
        `/api/pedidos/${id}`,
        fetcherPedido
    );

    const atualizarStatus = async () => {
        try {
            setMensagem("Atualizando status...");

            const response = await fetch(`/api/pedidos/${id}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: novoStatus }),
            });

            const json = await response.json();

            if (!response.ok) {
                const erro = json.detalhe ?? {};

                setMensagem(
                    [
                        `❌ Erro: ${erro.message ?? "Erro ao atualizar status."}`,
                        `Status atual: ${erro.status_atual ?? "desconhecido"}`,
                        `Tentando ir para: ${erro.tentando_ir_para ?? "desconhecido"}`,
                        `Permitidos: ${(erro.permitidos ?? []).join(", ") || "nenhum"}`
                    ].join("\n")
                );
            } else {
                setMensagem("✅ Status atualizado com sucesso.");
                mutate(); // Revalida o SWR
            }
        } catch (e) {
            setMensagem("Erro inesperado ao tentar atualizar o status.");
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Detalhes do Pedido</h1>

            {erroPedido ? (
                <p className="text-red-600">Erro ao carregar pedido</p>
            ) : !responsePedido ? (
                <p>Carregando...</p>
            ) : (
                <>
                    <p><strong>ID:</strong> {responsePedido.id}</p>
                    <p><strong>ID do Usuário:</strong> {responsePedido.id_usuario}</p>
                    <p><strong>Status:</strong> {responsePedido.status}</p>
                    <p><strong>Total:</strong> R$ {Number(responsePedido.total_valor).toFixed(2)}</p>

                    <div className="mt-4">
                        <label className="block mb-2">Atualizar Status</label>
                        <select
                            value={novoStatus}
                            onChange={(e) => setNovoStatus(e.target.value)}
                            className="border p-2 rounded mb-2"
                        >
                            <option value="">Selecione um status</option>
                            {Object.values(StatusPedido).map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                            onClick={atualizarStatus}
                        >
                            Atualizar Status
                        </button>
                    </div>

                    {mensagem && (
                        <p className="mt-4 text-sm text-center whitespace-pre-wrap">{mensagem}</p>
                    )}

                    <h2 className="text-xl font-semibold mt-6">Itens:</h2>
                    <ul className="list-disc ml-6">
                        {responsePedido.itens.map((item: { id_produto: number, quantidade: number }, i: number) => (
                            <li key={i}>
                                Produto ID: {item.id_produto} – Quantidade: {item.quantidade}
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
}
