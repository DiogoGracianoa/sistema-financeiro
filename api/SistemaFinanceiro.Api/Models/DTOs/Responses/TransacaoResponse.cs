using SistemaFinanceiro.Api.Models.Enums;

namespace SistemaFinanceiro.Api.Models.DTOs.Responses;

public class TransacaoResponse
{
    public int Id { get; set; }
    public string Descricao { get; set; } = string.Empty;
    public decimal Valor { get; set; }
    public TipoTransacaoEnum IdTipo { get; set; }
    public int IdCategoria { get; set; }
    public DateTime DataCriacao { get; set; }
}
