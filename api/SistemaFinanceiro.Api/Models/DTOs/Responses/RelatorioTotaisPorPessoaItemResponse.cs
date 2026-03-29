namespace SistemaFinanceiro.Api.Models.DTOs.Responses;

public class RelatorioTotaisPorPessoaItemResponse
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public decimal Receitas { get; set; }
    public decimal Despesas { get; set; }
    public decimal Saldo { get; set; }
}
