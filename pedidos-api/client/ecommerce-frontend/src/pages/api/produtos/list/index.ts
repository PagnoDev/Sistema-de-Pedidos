import type { NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'cookie';
import axios from 'axios'; // <--- direto da lib, sem baseURL

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const cookies = parse(req.headers.cookie || '');
  const token = cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'Não autenticado' });
  }

  
  try {
    const response = await axios.get('http://localhost:8000/api/produtos/list', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.status(200).json(response.data);
  } catch (error: any) {
    return res.status(500).json({
      error: 'Erro ao buscar produtos',
      detalhe: error?.response?.data || null,
    });
  }
}
