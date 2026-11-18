# 🏥 Norte Médica — E-Commerce Médico-Hospitalar (Next.js + TypeScript + Tailwind CSS)

Clone de alta fidelidade da plataforma **Norte Médica** com **190 produtos reais**, logo e ícone oficiais, busca otimizada, carrinho com state management, checkout completo (PIX 10% OFF com QR Code, Cartão até 12x e Boleto PJ) e painel administrativo.

## 🚀 Arquitetura & Stack (Branch `main` — Produção na Vercel)
- **Framework:** Next.js (App Router + Server Components para SEO e performance)
- **Linguagem:** TypeScript estrito
- **Estilização:** Tailwind CSS + Lucide Icons (padrão visual da área da saúde e acessibilidade)
- **Catálogo Real:** 190 produtos, 13 departamentos médicos e 79 marcas fabricantes pré-renderizados estaticamente (SSG) com metadados SEO individuais por produto
- **APIs Serverless:** `/api/produtos` (busca autocomplete), `/api/frete` (simulação PAC/SEDEX/Transportadora por CEP) e `/api/pedidos` (processamento de checkout)

## 🐊 Versão HostGator / cPanel (PHP + MySQL/SQLite)
A versão completa em **PHP 8 + SQLite/MySQL** com instalador 1-clique (`install.php`) para HostGator está preservada integralmente na branch **`hostgator-php`**, junto ao script [database.sql](database.sql) e ao guia [GUIA_HOSTGATOR.md](GUIA_HOSTGATOR.md).

## 💻 Rodando Localmente
```bash
npm install
npm run dev
```
Acesse `http://localhost:3000`.

## 🔑 Painel Administrativo
- **Rota:** `/admin`
- **Usuário:** `admin`
- **Senha:** `admin123`
