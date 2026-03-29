using SistemaFinanceiro.Api.Models.Entities;

namespace SistemaFinanceiro.Api.Repositories.Interfaces;

public interface ITransacoesRepository
{
    Task<List<TransacaoEntity>> ObterTodasAtivasAsync();
    Task<TransacaoEntity> AdicionarAsync(TransacaoEntity transacao);
}
