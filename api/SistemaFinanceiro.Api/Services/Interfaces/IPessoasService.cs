using SistemaFinanceiro.Api.Models.DTOs.Requests;
using SistemaFinanceiro.Api.Models.DTOs.Responses;

namespace SistemaFinanceiro.Api.Services.Interfaces;
public interface IPessoasService
{
    Task<List<PessoaResponse>> ObterPessoasAsync();
    Task<PessoaResponse> CriarPessoaAsync(PessoaRequest pessoa);
    Task<PessoaResponse> AtualizarPessoaAsync(int id, PessoaRequest pessoa);
    Task<bool> DeletarPessoaAsync(int id);
}
