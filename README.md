# Projeto Talos
(Em desenvolvimento)

## Descrição
O Projeto Talos é uma aplicação backend desenvolvida em NestJS que tem como objetivo permitir o gerenciamento completo de carteiras de investimento em ações.
O sistema possibilita que o usuário cadastre, gerencie e avalie ações, bem como monitore o desempenho e o risco total de seu portfólio.

A aplicação integra-se a duas fontes externas principais:

1. **[Yahoo Finance (YFinance API)](https://pypi.org/project/yfinance/)** — utilizada para **obter informações atualizadas e detalhadas sobre as ações**, como preço, volatilidade e dividend yield.  

2. **[Portfolio Optimized API](https://github.com/dandinCode/portfolioOptimizedAPI/blob/main/app/optimizer.py)** — um serviço externo responsável por **calcular a melhor combinação de ativos** dentro de um conjunto de ações, com base em métricas de risco e retorno esperados.  

---

Com essa arquitetura, o sistema permitirá:

- Registrar ações e símbolos financeiros manualmente.  
- Sincronizar dados de mercado em tempo real através da YFinance API.  
- Criar e gerenciar carteiras de investimento.  
- Avaliar automaticamente o risco e retorno de cada portfólio.  
- Obter sugestões otimizadas de alocação de ativos para maximizar o retorno esperado com base no perfil de risco do investidor.  

## Stack Tecnológica

- NestJS – Framework backend principal (arquitetura modular e escalável)

- Prisma ORM – Mapeamento e acesso ao banco de dados

- MySQL – Banco de dados relacional utilizado para persistência dos dados

- TypeScript – Linguagem base do projeto

- Jest – Testes unitários e end-to-end

- YFinance API – Fonte de dados de mercado financeiro
  
- Portfolio Optimized API (Python) – Serviço externo para cálculo da combinação ideal de investimentos

## Pré-requisitos

- [Node.js](https://nodejs.org/) (>= 18)
- [MySQL](https://www.mysql.com/)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

## Configuração do ambiente

Crie um arquivo `.env` na raiz do projeto com:

```env
DATABASE_URL="mysql://root:senha@localhost:3306/portfolio_manager"
```

## Preparação

```bash
$ npm install
$ npx prisma migrate dev --name init
$ npx prisma generate

```

## Rodar projeto

```bash
# watch mode
$ npm run start:dev
```

## Rodar testes

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

