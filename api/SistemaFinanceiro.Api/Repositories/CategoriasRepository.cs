using Dapper;
using SistemaFinanceiro.Api.Models.Entities;
using SistemaFinanceiro.Api.Repositories.Base;
using SistemaFinanceiro.Api.Repositories.Interfaces;
using System.Data;

namespace SistemaFinanceiro.Api.Repositories;

public class CategoriasRepository(ILogger<CategoriasRepository> logger, IConfiguration configuration) : PgsqlBaseRepository(logger, configuration), ICategoriasRepository
{
    public async Task<List<CategoriaEntity>> ObterTodasAsync()
    {
        const string sql = @"
            SELECT
                id as Id,
                descricao as Descricao,
                id_finalidade as IdFinalidade,
                data_criacao as DataCriacao
            FROM categorias
            ORDER BY descricao ASC;";

        using IDbConnection connection = Connection;
        var categorias = await connection.QueryAsync<CategoriaEntity>(sql);

        return categorias.AsList();
    }

    public async Task<CategoriaEntity?> ObterPorIdAsync(int id)
    {
        const string sql = @"
            SELECT
                id as Id,
                descricao as Descricao,
                id_finalidade as IdFinalidade,
                data_criacao as DataCriacao
            FROM categorias
            WHERE id = @Id;";

        using IDbConnection connection = Connection;

        var categoria = await connection.QuerySingleOrDefaultAsync<CategoriaEntity>(sql, new { Id = id });

        return categoria;
    }

    public async Task<CategoriaEntity> AdicionarAsync(CategoriaEntity categoria)
    {
        const string sql = @"
            INSERT INTO categorias (descricao, id_finalidade)
            VALUES (@Descricao, @IdFinalidade)
            RETURNING
                id AS Id,
                descricao AS Descricao,
                id_finalidade AS IdFinalidade,
                data_criacao AS DataCriacao;";

        using IDbConnection connection = Connection;

        var categoriaCriada = await connection.QuerySingleAsync<CategoriaEntity>(sql, categoria);

        return categoriaCriada;
    }
}
