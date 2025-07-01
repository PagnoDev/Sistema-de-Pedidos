import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { parse } from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const cookies = parse(req.headers.cookie || '');
  const token = cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'Não autenticado' });
  }

  try {
    const response = await axios.post(
      'http://localhost:8000/api/pedidos',
      {
        id_usuario: req.body.id_usuario,
        itens: req.body.itens,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        validateStatus: () => true // <- permite capturar manualmente status diferentes de 2xx
      }
    );

    if (response.status >= 200 && response.status < 300) {
      return res.status(response.status).json(response.data);
    }

    // Se chegou aqui, é erro vindo do Laravel (ex: 400, 404, 422, 500)
    return res.status(response.status).json({
      error: response.data.erro || response.data.message || 'Erro ao processar o pedido',
      detalhes: response.data,
    });

  } catch (error: any) {
    return res.status(500).json({
      error: 'Erro inesperado ao comunicar com a API Laravel.',
      detalhes: error?.message || null,
    });
  }
}
