import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { parse } from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    const cookies = parse(req.headers.cookie || "");
    const token = cookies.token;

    if (!token) {
        return res.status(401).json({ error: "Não autenticado" });
    }

    const { status } = req.body;

    try {
        const { status } = req.body;

        const response = await axios.patch(
            `http://localhost:8000/api/pedidos/${id}/status`,
            { status },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        res.status(200).json(response.data);
    } catch (error: any) {
        res.status(500).json({ error: "Erro ao buscar detalhes do pedido", detalhe: error?.response?.data || null });
    }
}
