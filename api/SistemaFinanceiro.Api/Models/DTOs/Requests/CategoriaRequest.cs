using SistemaFinanceiro.Api.Models.Enums;
using System.ComponentModel.DataAnnotations;

namespace SistemaFinanceiro.Api.Models.DTOs.Requests;


public class CategoriaRequest
{
    [Required(ErrorMessage = "Descrição é obrigatória.")]
    [StringLength(400, MinimumLength = 2, ErrorMessage = "Descrição deve ter entre 2 e 400 caracteres.")]
    public string Descricao { get; set; } = string.Empty;

    [EnumDataType(typeof(FinalidadeCategoriaEnum), ErrorMessage = "Finalidade inválida. Opções válidas: 1 = Despesa, 2 = Receita, 3 = Ambas.")]
    public FinalidadeCategoriaEnum IdFinalidade { get; set; }
}
