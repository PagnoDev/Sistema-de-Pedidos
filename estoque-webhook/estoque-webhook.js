// webhook.js

require('dotenv').config();

const express = require('express');
const { Pool } = require('pg');
const app = express();

app.use(express.json());

// Configuração do banco PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Rota para deduzir estoque
app.post('/webhook/atualizar-estoque', async (req, res) => {
  const { id_produto, quantidade } = req.body;

  if (!id_produto || quantidade === undefined) {
    return res.status(400).json({ erro: 'id_produto e quantidade são obrigatórios.' });
  }

  try {
    const resultado = await pool.query(
      'SELECT quantidade_estoque FROM produtos WHERE id = $1',
      [id_produto]
    );

    if (resultado.rowCount === 0) {
      return res.status(404).json({ erro: 'Produto não encontrado.' });
    }

    const estoqueAtual = resultado.rows[0].quantidade_estoque;

    if (estoqueAtual < quantidade) {
      return res.status(400).json({
        erro: 'Estoque insuficiente.',
        estoque_disponivel: estoqueAtual
      });
    }

    const novoEstoque = estoqueAtual - quantidade;

    const update = await pool.query(
      'UPDATE produtos SET quantidade_estoque = $1 WHERE id = $2 RETURNING *',
      [novoEstoque, id_produto]
    );

    return res.status(200).json({
      mensagem: 'Estoque deduzido com sucesso.',
      produto: update.rows[0],
    });

  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ erro: 'Erro interno ao atualizar estoque.' });
  }
});

const PORTA = 3001;
app.listen(PORTA, () => {
  console.log(`Webhook rodando na porta ${PORTA}`);
});
