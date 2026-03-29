using SistemaFinanceiro.Api.Models.DTOs.Requests;
using SistemaFinanceiro.Api.Models.DTOs.Responses;

namespace SistemaFinanceiro.Api.Services.Interfaces;

public interface ITransacoesService
{
    Task<List<TransacaoResponse>> ObterTransacoesAsync();
    Task<TransacaoCriadaResponse> CriarTransacaoAsync(TransacaoRequest transacao);
}
