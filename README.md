# Sistema Financeiro

Repositório contendo os projetos do sistema financeiro, separados por responsabilidade:

- Banco de dados (Liquibase)
- API (backend)
- Frontend

---

## Estrutura do Repositório

```
.
├── liquibase/ # Controle de versionamento do banco
├── api/ # Backend do sistema
└── front/ # Interface do usuário
```
---

# Liquibase - Sistema Financeiro

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

# API - Sistema Financeiro

# Frontend - Sistema Financeiro
