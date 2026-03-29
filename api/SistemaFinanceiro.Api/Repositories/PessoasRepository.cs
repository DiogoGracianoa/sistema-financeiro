using Dapper;
using SistemaFinanceiro.Api.Models.Entities;
using SistemaFinanceiro.Api.Repositories.Base;
using SistemaFinanceiro.Api.Repositories.Interfaces;
using System.Data;

namespace SistemaFinanceiro.Api.Repositories;

public class PessoasRepository(ILogger<PessoasRepository> logger, IConfiguration configuration) : PgsqlBaseRepository(logger, configuration), IPessoasRepository
{
    public async Task<List<PessoaEntity>> ObterTodasAsync()
    {
        const string sql = @"
            SELECT
                id as Id,
                idade as Idade,
                nome as Nome,
                ativo as Ativo,
                data_criacao as DataCriacao
            FROM pessoas
            WHERE ativo = true
            ORDER BY nome ASC;";

        using IDbConnection connection = Connection;
        var pessoas = await connection.QueryAsync<PessoaEntity>(sql);

        return pessoas.AsList();
    }

    public async Task<PessoaEntity> AdicionarAsync(PessoaEntity pessoa)
    {
        const string sql = @"
            INSERT INTO pessoas (nome, idade, ativo, data_criacao)
            VALUES (@Nome, @Idade, @Ativo, @DataCriacao)
            RETURNING 
                id AS Id,
                nome AS Nome,
                idade AS Idade,
                ativo AS Ativo,
                data_criacao AS DataCriacao;";

        using IDbConnection connection = Connection;

        var pessoaCriada = await connection.QuerySingleAsync<PessoaEntity>(sql, pessoa);

        return pessoaCriada;
    }

    public async Task<PessoaEntity> AtualizarAsync(int id, PessoaEntity pessoa)
    {
        const string sql = @"
            UPDATE pessoas SET 
                nome = @Nome,
                idade = @Idade
            WHERE id = @Id
            RETURNING 
                id AS Id,
                nome AS Nome,
                idade AS Idade,
                ativo AS Ativo,
                data_criacao AS DataCriacao;";

        using IDbConnection connection = Connection;

        var pessoaAtualizada = await connection.QuerySingleAsync<PessoaEntity>(
            sql,
            new { Id = id, pessoa.Nome, pessoa.Idade }
        );

        return pessoaAtualizada;
    }

    public async Task<bool> DeletarAsync(int id)
    {
        const string sql = @"
            UPDATE pessoas SET 
                ativo = false
            WHERE id = @Id;";

        using IDbConnection connection = Connection;

        var linhasAfetadas = await connection.ExecuteAsync(sql, new { Id = id });

        return linhasAfetadas > 0;
    }
}
