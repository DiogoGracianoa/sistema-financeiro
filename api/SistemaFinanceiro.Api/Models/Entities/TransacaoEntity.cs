using SistemaFinanceiro.Api.Models.Enums;

namespace SistemaFinanceiro.Api.Models.Entities;

public class TransacaoEntity
{
    public int Id { get; set; }
    public int IdPessoa { get; set; }
    public string Descricao { get; set; } = string.Empty;
    public decimal Valor { get; set; }
    public TipoTransacaoEnum IdTipo { get; set; }
    public int IdCategoria { get; set; }
    public bool Ativo { get; set; }
    public DateTime DataCriacao { get; set; }
}
