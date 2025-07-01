# Desafio Pleno – Sistema de Pedidos

Este projeto foi desenvolvido em **2 dias** como solução para o desafio proposto. Ele consiste em um sistema completo de pedidos, com autenticação segura, comunicação entre serviços e um painel de controle com filtros e paginação.

## 🧱 Arquitetura do Projeto

O projeto está dividido em três partes principais:

```
pedidos/
├── client/        # Frontend (Next.js + SWR)
├── server/        # Backend principal (Laravel + PostgreSQL)
├── estoque-webhook/  # Webhook externo (Node.js + Express + PostgreSQL)
```

---

## ⚙️ Requisitos Atendidos

| Requisito                                             | Atendido | Como foi implementado                                                                 |
|-------------------------------------------------------|----------|----------------------------------------------------------------------------------------|
| Autenticação segura                                   | ✅       | Utilizado JWT + cookies HttpOnly para proteção contra XSS e CSRF                      |
| Cadastro de pedido                                    | ✅       | Pedido é registrado com múltiplos itens e valor total calculado                       |
| Atualização do estoque por webhook                   | ✅       | Webhook em Node.js que recebe requisição e atualiza o estoque com validações          |
| Filtros por status, usuário, ordenação e paginação    | ✅       | Aplicados via query string e tratados diretamente no controller Laravel               |
| Exibição dos pedidos com detalhes                    | ✅       | Detalhes do pedido com todos os itens listados                                         |
| Middleware para proteger rotas                        | ✅       | Middleware Next.js impede acesso sem token e redireciona para login                   |
| Seed com dados de exemplo                             | ✅       | Seeds criam usuários, produtos e pedidos automaticamente                               |

---

## 👤 Usuário de Testes

- **Email:** `test@example.com`  
- **Senha:** `123123`

---

## 🚀 Como rodar o projeto (modo desenvolvimento)

> A execução deve seguir esta ordem:

1. ### Iniciar Webhook (porta `3001`)

```bash
cd estoque-webhook
node estoque-webhook.js
```

> Configurações no `.env` incluem acesso ao banco PostgreSQL.

---

2. ### Iniciar Backend Laravel (porta `8000`)

```bash
cd server
php artisan migrate:fresh --seed
php artisan serve
```

> O `.env` define o banco de dados PostgreSQL, além do `JWT_SECRET`.  
> As seeds populam o banco automaticamente com usuários, produtos e pedidos.

---

3. ### Iniciar Frontend Next.js (porta `3000`)

```bash
cd client/ecommerce-frontend
npm install
npm run dev
```

> O frontend consome as APIs do Laravel e faz chamadas ao webhook via Laravel.

---

## 🧪 Funcionalidades do Frontend

- Login com cookies HttpOnly
- Página protegida por middleware (`middleware.ts`)
- Criação de pedido com múltiplos produtos
- Filtros por status, usuário, ordenação e paginação
- Atualização de status via botão na tela de detalhes
- Logout (limpa o cookie)

---

## 📁 Estrutura de Pastas

```
pedidos/
├── client/            # Frontend em Next.js
├──── ecommerce-frontend/
│──────├── src/
│──────│   ├── pages/api  # Endpoints intermediários
│──────│   └── app/       # Páginas com autenticação protegida
│──────└── middleware.ts  # Verifica token JWT para proteger rotas

├── server/            # Backend em Laravel
│   ├── .env
│   ├── app/Http/Controllers
│   ├── app/Models
│   ├── database/migrations
│   └── database/seeders

├── estoque-webhook/   # Webhook de estoque
│   ├── estoque-webhook.js
│   └── .env            # Configurações do banco
```

---

## 🛡️ Segurança

- JWT é utilizado como token de autenticação
- Cookies HttpOnly previnem ataques XSS e CSRF

---

## 📝 Observações Finais

- Banco PostgreSQL utilizado em todas as camadas
- Requisições assíncronas seguras e bem tratadas
