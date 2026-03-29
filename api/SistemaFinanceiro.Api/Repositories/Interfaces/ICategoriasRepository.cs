using SistemaFinanceiro.Api.Models.Entities;

namespace SistemaFinanceiro.Api.Repositories.Interfaces;

public interface ICategoriasRepository
{
    Task<List<CategoriaEntity>> ObterTodasAsync();
    Task<CategoriaEntity> AdicionarAsync(CategoriaEntity categoria);
}
