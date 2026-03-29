using SistemaFinanceiro.Api.Models.Enums;

namespace SistemaFinanceiro.Api.Models.DTOs.Responses;

public class TransacaoCategoriaResponse
{
    public int Id { get; set; }
    public FinalidadeCategoriaEnum IdFinalidade { get; set; }
}
