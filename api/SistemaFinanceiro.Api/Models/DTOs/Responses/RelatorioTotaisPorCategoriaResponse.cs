namespace SistemaFinanceiro.Api.Models.DTOs.Responses;

public class RelatorioTotaisPorCategoriaResponse
{
    public List<RelatorioTotaisPorCategoriaItemResponse> Categorias { get; set; } = [];
    public RelatorioTotalGeralResponse TotalGeral { get; set; } = new();
}
