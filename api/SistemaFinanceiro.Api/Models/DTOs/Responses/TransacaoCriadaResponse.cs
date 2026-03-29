using SistemaFinanceiro.Api.Models.Enums;

namespace SistemaFinanceiro.Api.Models.DTOs.Responses;

public class TransacaoCriadaResponse
{
    public int Id { get; set; }
    public int IdPessoa { get; set; }
    public string Descricao { get; set; } = string.Empty;
    public decimal Valor { get; set; }
    public TipoTransacaoEnum IdTipo { get; set; }
    public TransacaoCategoriaResponse Categoria { get; set; } = new();
    public DateTime DataCriacao { get; set; }
}
