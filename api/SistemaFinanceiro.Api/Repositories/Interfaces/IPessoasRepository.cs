using SistemaFinanceiro.Api.Models.Entities;
namespace SistemaFinanceiro.Api.Repositories.Interfaces;

public interface IPessoasRepository
{
    Task<List<PessoaEntity>> ObterTodasAsync();
    Task<PessoaEntity> AdicionarAsync(PessoaEntity pessoa);
    Task<PessoaEntity> AtualizarAsync(int id, PessoaEntity pessoa);
    Task<bool> DeletarAsync(int id);
}
