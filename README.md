# Sistema Financeiro

Repositório contendo os projetos do sistema financeiro, separados por responsabilidade:

- Banco de dados (Liquibase)
- API (backend)
- Frontend

---

## Estrutura do Repositório

.
├── liquibase/ # Controle de versionamento do banco
├── api/ # Backend do sistema
└── front/ # Interface do usuário

---

# > Liquibase - Sistema Financeiro

Guia para subir o banco local e aplicar os changeSets do sistema financeiro.

## Pré-requisitos

- Rancher Desktop ou Docker Engine instalado
- Docker Compose instalado
- Java (JRE ou JDK)
- Liquibase instalado (opcional para execuções manuais)

---

## Subir ambiente local

1. No diretório `liquibase`, execute:

```
docker-compose -f docker-compose-local.yml -p api-sistema-financeiro up -d --force-recreate --renew-anon-volumes
```

Isso sobe Postgres (porta local 54320) e roda o contêiner Liquibase que aplica o changelog database/changelog/master.yaml automaticamente.

2. Verifique contêineres:

```
docker ps
```

3. Logs

```
docker-compose -f docker-compose-local.yml -p api-sistema-financeiro logs -f
```

---

## Encerrar ambiente

```
docker-compose -f docker-compose-local.yml -p api-sistema-financeiro down
```

---

## Referência

Documentação do liquibase: https://docs.liquibase.com/home.html

---

# > API - Sistema Financeiro

Guia para rodar a API localmente.

## Pré-requisitos

- .NET 9 SDK
- Banco local ativo (suba primeiro o `docker-compose` em `liquibase`, usa Postgres na porta 54320)

## Executar a API

1. No diretório `api/SistemaFinanceiro.Api`, restaure dependências (opcional se já estiver em cache):

```
dotnet restore
```

2. Execute a API:

```
dotnet run --project SistemaFinanceiro.Api
```

3. Endpoints e documentação:

- Base URL: http://localhost:5172
- Documentação interativa (via Scalar): http://localhost:5172/scalar

## Configuração

- Connection string padrão (Postgres local) está em `api/SistemaFinanceiro.Api/appsettings.json` e aponta para `Host=localhost;Port=54320;Database=sistema_financeiro_local;Username=postgres;Password=postgres2026!`.
  - Essa connection string é apenas para ambiente local e **não contém dados sensíveis de produção**. Por esse motivo, ela está presente no repositório, mas no cenário de produção, estes valores sensíveis são mantidos fora do git.

- Para sobrepor via variável de ambiente, use `ConnectionStrings__DefaultConnection`.

## Testes

```
dotnet test api/SistemaFinanceiro.Api.Tests/SistemaFinanceiro.Api.Tests.csproj
```

# > Frontend - Sistema Financeiro
