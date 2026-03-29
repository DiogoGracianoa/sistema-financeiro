using SistemaFinanceiro.Api.Models.Enums;

namespace SistemaFinanceiro.Api.Models.DTOs.Responses;

public class CategoriaResponse
{
    public int Id { get; set; }
    public string Descricao { get; set; } = string.Empty;
    public FinalidadeCategoriaEnum IdFinalidade { get; set; }
    public DateTime DataCriacao { get; set; }
}
