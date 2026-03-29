using SistemaFinanceiro.Api.Models.Enums;

namespace SistemaFinanceiro.Api.Models.Entities;

public class CategoriaEntity
{
    public int Id { get; set; }
    public string Descricao { get; set; } = string.Empty;
    public FinalidadeCategoriaEnum IdFinalidade { get; set; }
    public DateTime DataCriacao { get; set; }
}
