namespace SistemaFinanceiro.Api.Models.DTOs.Responses;

public class RelatorioTotalGeralResponse
{
    public decimal Receitas { get; set; }
    public decimal Despesas { get; set; }
    public decimal Saldo { get; set; }
}
