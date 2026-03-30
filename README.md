# Sistema Financeiro

Aplicação full-stack para controle financeiro pessoal/empresarial: cadastro de pessoas e categorias, registro de transações e geração de relatórios consolidados por pessoa ou categoria.

O projeto é dividido em três partes: banco (Liquibase/Postgres), API em .NET e frontend em React + Vite.

## Visão geral

- API REST para controle financeiro
- Frontend SPA em React
- Banco versionado com Liquibase
- Setup completo via Docker

## Status do projeto

- Em desenvolvimento (atualmente é um MVP funcional para uso local e evolução incremental)

## Tecnologias e pré-requisitos

- Backend: .NET 9, ASP.NET Core, Dapper, Npgsql, Scalar (OpenAPI UI).
- Frontend: React 18, Vite 5, TypeScript 5, TanStack Query (React Query), React Router, React Hook Form, Zod.
- Banco: PostgreSQL 12 + Liquibase para versionamento.
- Ferramentas: Docker Compose (ou Rancher Desktop), Node.js >= 20 LTS, npm, Java (para Liquibase CLI opcional)

## Estrutura do repositório

```
.
├── api/                   # API ASP.NET Core
│   ├── SistemaFinanceiro.Api/
│   └── SistemaFinanceiro.Api.Tests/
├── frontend/              # SPA React + Vite
└── liquibase/             # Infra de banco + changelog
```

## Decisões de projeto (arquitetura e escolhas)

### Principais escolhas:

- Arquitetura em camadas
- Dapper para controle de queries
- Liquibase para versionamento
- React com organização por features

### Detalhamento:

- API (ASP.NET Core, .NET 9)
  - Arquitetura em camadas: Controllers -> Services -> Repositories (Dapper) para manter baixo acoplamento e facilitar os testes.
  - Dapper em vez de ORM completo (EF) para reduzir overhead, controlar SQL explícito e otimizar desempenho/claridade das consultas.
  - DTOs específicos para requests/responses e wrapper `BaseResponse<T>` para padronizar payloads e mensagens de retorno.
  - Versionamento por rota `api/v1` e documentação via Scalar (OpenAPI) para descobribilidade rápida.
  - CORS liberado e cultura pt-BR configurada em `Program.cs` para alinhar formatação numérica/data com o domínio.
  - Middleware de exceção centralizado para respostas consistentes de erro, sem duplicidade nas Controllers.

- Banco de dados (PostgreSQL + Liquibase)
  - Versionamento de schema via Liquibase para rastreabilidade e reprodutibilidade entre ambientes.
  - Imagens Docker sobem Postgres (porta 54320) e aplicam changelog automaticamente, minimizando a necessidade de setup manual.
  - Changelog em `liquibase/database/changelog` organizado sob `master.yaml`; credenciais locais explícitas apenas para desenvolvimento local.

- Frontend (React + Vite + TypeScript)
  - Estrutura por features (`src/features/*`) para favorecer coesão e evolução isolada de domínios.
  - TanStack Query (React Query) para cache, revalidação e estados de requisição previsíveis.
  - React Hook Form + Zod para formulários com validação declarativa e tipada.
  - React Router para navegação SPA; client HTTP centralizado em `src/api/httpClient.ts` com base URL configurável (`VITE_API_URL`).
  - Vite como bundler/dev server para melhor experiência de desenvolvimento, com inicialização quase instantânea, HMR sem recarregar a página e builds de produção enxutos.

- Motivações gerais
  - Foco em MVP funcional: escolhas privilegiam simplicidade e rapidez de entrega sem prejudicar a qualidade.
  - API e frontend desacoplados para permitir deploy/evolução independentes.
  - Infra como código (docker-compose + Liquibase) para onboarding rápido e ambiente reprodutível.

## Configuração e variáveis

- API
  - Connection string local em `api/SistemaFinanceiro.Api/appsettings.json` (usa Postgres na porta 54320).
  - Pode ser sobrescrita por variável: `ConnectionStrings__DefaultConnection`.
- Frontend
  - Base URL da API via `.env.local`: `VITE_API_URL=http://localhost:5172/api/v1` (fallback para esse valor se não definido) conforme `frontend/src/api/httpClient.ts`.
- Banco
  - `liquibase/docker-compose-local.yml` sobe Postgres e aplica o changelog automaticamente.
  - Credenciais locais: usuário `postgres`, senha `postgres2026!`, database `sistema_financeiro_local`.

> ⚠️ Observação:
> As credenciais presentes no projeto são exclusivamente para ambiente local.
> Em ambiente de produção, dados sensíveis são armazenados via variáveis de ambiente por meio de ferramentas de secret management.

## Instalação e setup rápido

1. Clonar o repositório

```bash
git clone https://github.com/DiogoGracianoa/sistema-financeiro.git
cd sistema-financeiro
```

2. Subir banco local (Liquibase + Postgres)

- É possível realizar a subida do banco no Windows através do WSL. Isso pode ser mais simples, pois evita instalação de Rancher Desktop para Windows, mas requer instalação do WSL.

```bash
cd liquibase
docker-compose -f docker-compose-local.yml -p api-sistema-financeiro up -d --force-recreate --renew-anon-volumes
```

3. Rodar a API

```bash
cd ../api/SistemaFinanceiro.Api
dotnet restore
dotnet run --project SistemaFinanceiro.Api
# Servidor em http://localhost:5172
```

4. Rodar o frontend

```bash
cd ../../frontend
npm install
# opcional: echo "VITE_API_URL=http://localhost:5172/api/v1" > .env.local
npm run dev
# SPA em http://localhost:5173
```

## Uso rápido da API

- Documentação interativa (Scalar): http://localhost:5172/scalar
- Endpoints principais (base `http://localhost:5172/api/v1`):
  - `GET /categorias` – lista categorias
  - `POST /categorias` – cria categoria (campos principais: `nome`, `idFinalidade`)
  - `GET /pessoas` – lista pessoas
  - `POST /pessoas` – cria pessoa
  - `PUT /pessoas/{id}` – atualiza pessoa
  - `DELETE /pessoas/{id}` – deleta logicamente
  - `GET /transacoes` – lista transações ativas
  - `POST /transacoes` – cria transação (campos principais: `idCategoria`, `idPessoa`, `idTipo`, `valor`, `descricao`, `data`)
  - `GET /relatorios/totais-por-categoria` – totais por categoria
  - `GET /relatorios/totais-por-pessoa` – totais por pessoa

Exemplo de chamada (criar transação):

```bash
curl -X POST http://localhost:5172/api/v1/transacoes \
  -H "Content-Type: application/json" \
  -d '{
    "idCategoria": 1,
    "idPessoa": 1,
    "idTipo": 1,
    "valor": 120.50,
    "descricao": "Compra supermercado",
    "data": "2024-10-10"
  }'
```

## Funcionalidades principais

- Cadastro e listagem de pessoas (CRUD com delete lógico)
  - Interface:
    ![Tela de cadastro de pessoas](docs\images\tela-pessoas.png)
- Cadastro e listagem de categorias
  - Interface:
    ![Tela de categorias](docs\images\tela-categorias.png)
- Registro e listagem de transações (receitas e despesas)
  - Interface:
    ![Tela de transações](docs\images\tela-transacoes.png)
- Relatórios consolidados por pessoa e por categoria
  - Interface:
    ![Tela de relatório por pessoa](docs\images\tela-relatorios-pessoa.png)
    ![Tela de relatório por categorias](docs\images\tela-relatorios-categorias.png)
- UI com navegação SPA (pessoas, categorias, transações, relatórios) e TanStack Query para cache de dados

## Próximos passos

- Autenticação e autorização
- Dashboard com gráficos
- Deploy em nuvem (Docker + CI/CD)
- Testes E2E no frontend

## Convenções de projeto

- Linguagem: C# 12 (.NET 9) no backend, TypeScript no frontend
- API versionada via rota `api/v1`
- Respostas padronizadas com wrapper `BaseResponse<T>`
- CORS habilitado e cultura pt-BR configurada em `Program.cs`

## Testes e qualidade

- Backend: `dotnet test api/SistemaFinanceiro.Api.Tests/SistemaFinanceiro.Api.Tests.csproj`
- Frontend: `npm run lint` e `npm run build`

## Contribuição

- Abra issues com contexto, passos para reproduzir e logs relevantes
- Crie branches curtas por escopo (`feature/nome-curto`, `fix/descricao`)
- Para PRs: inclua descrição clara, prints/links da documentação de API e execute testes/lint antes de abrir

## Contatos / referências

- Documentação Liquibase: https://docs.liquibase.com/home.html
- Para dúvidas ou sugestões, abra uma issue neste repositório.
- Desenvolvedor do projeto: Diogo Alves Graciano (GitHub: https://github.com/DiogoGracianoa)
