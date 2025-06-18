import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { serialize } from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method == 'POST') {

    try {
      const response = await axios.post('http://localhost:8000/api/login', req.body);

      const token = response.data.token;

      if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
      }

      res.setHeader('Set-Cookie', serialize('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24, // 1 dia
      }));

      return res.status(200).json({ ok: true });
    } catch (error: any) {
      return res.status(error?.response?.status || 500).json({
        error: 'Erro ao fazer login',
        detalhe: error?.response?.data || null,
      });
    }
  }

  if (req.method === 'DELETE') {
    res.setHeader(
      'Set-Cookie',
      serialize('token', '', {
        path: '/',
        httpOnly: true,
        maxAge: -1, // remove
      })
    );
    return res.status(200).json({ message: 'Logout realizado com sucesso.' });
  }

  return res.status(405).json({ error: 'Método não permitido' });
}
