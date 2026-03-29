using Dapper;
using SistemaFinanceiro.Api.Models.Entities;
using SistemaFinanceiro.Api.Repositories.Base;
using SistemaFinanceiro.Api.Repositories.Interfaces;
using System.Data;

namespace SistemaFinanceiro.Api.Repositories;

public class TransacoesRepository(ILogger<TransacoesRepository> logger, IConfiguration configuration) : PgsqlBaseRepository(logger, configuration), ITransacoesRepository
{
    public async Task<List<TransacaoEntity>> ObterTodasAtivasAsync()
    {
        const string sql = @"
            SELECT
                id as Id,
                id_pessoa as IdPessoa,
                descricao as Descricao,
                valor as Valor,
                tipo as IdTipo,
                id_categoria as IdCategoria,
                ativo as Ativo,
                data_criacao as DataCriacao
            FROM transacoes
            WHERE ativo = true
            ORDER BY data_criacao DESC;";

        using IDbConnection connection = Connection;
        var transacoes = await connection.QueryAsync<TransacaoEntity>(sql);

        return transacoes.AsList();
    }

    public async Task<TransacaoEntity> AdicionarAsync(TransacaoEntity transacao)
    {
        const string sql = @"
            INSERT INTO transacoes (id_pessoa, descricao, valor, tipo, id_categoria, ativo, data_criacao)
            VALUES (@IdPessoa, @Descricao, @Valor, @IdTipo, @IdCategoria, @Ativo, @DataCriacao)
            RETURNING
                id AS Id,
                id_pessoa AS IdPessoa,
                descricao AS Descricao,
                valor AS Valor,
                tipo AS IdTipo,
                id_categoria AS IdCategoria,
                ativo AS Ativo,
                data_criacao AS DataCriacao;";

        using IDbConnection connection = Connection;

        var transacaoCriada = await connection.QuerySingleAsync<TransacaoEntity>(sql, transacao);

        return transacaoCriada;
    }
}
