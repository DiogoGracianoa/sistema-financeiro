using SistemaFinanceiro.Api.Models.DTOs.Responses;

namespace SistemaFinanceiro.Api.Services.Interfaces;

public interface IRelatoriosService
{
    Task<RelatorioTotaisPorCategoriaResponse> ObterTotaisPorCategoriaAsync();
    Task<RelatorioTotaisPorPessoaResponse> ObterTotaisPorPessoaAsync();
}
