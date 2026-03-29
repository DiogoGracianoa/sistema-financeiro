using SistemaFinanceiro.Api.Models.Enums;

namespace SistemaFinanceiro.Api.Models.DTOs.Responses;

public class RelatorioTotaisPorCategoriaItemResponse
{
    public int Id { get; set; }
    public string Descricao { get; set; } = string.Empty;
    public FinalidadeCategoriaEnum IdFinalidade { get; set; }
    public decimal Receitas { get; set; }
    public decimal Despesas { get; set; }
    public decimal Saldo { get; set; }
}
