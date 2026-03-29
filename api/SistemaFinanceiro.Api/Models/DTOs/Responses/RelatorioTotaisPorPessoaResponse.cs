namespace SistemaFinanceiro.Api.Models.DTOs.Responses;

public class RelatorioTotaisPorPessoaResponse
{
    public List<RelatorioTotaisPorPessoaItemResponse> Pessoas { get; set; } = [];
    public RelatorioTotalGeralResponse TotalGeral { get; set; } = new();
}
