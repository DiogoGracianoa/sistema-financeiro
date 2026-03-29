using SistemaFinanceiro.Api.Models.Enums;
using System.ComponentModel.DataAnnotations;

namespace SistemaFinanceiro.Api.Models.DTOs.Requests;

public class TransacaoRequest
{
    [Range(1, int.MaxValue, ErrorMessage = "Pessoa é obrigatória.")]
    public int IdPessoa { get; set; }

    [Required(ErrorMessage = "Descrição é obrigatória.")]
    [StringLength(400, MinimumLength = 2, ErrorMessage = "Descrição deve ter entre 2 e 400 caracteres.")]
    public string Descricao { get; set; } = string.Empty;

    [Required(ErrorMessage = "Valor é obrigatório.")]
    [Range(typeof(decimal), "0,01", "79228162514264337593543950335", ErrorMessage = "Valor deve ser maior que zero.")]
    public decimal Valor { get; set; }

    [EnumDataType(typeof(TipoTransacaoEnum), ErrorMessage = "Tipo inválido. Opções válidas: 1 = Despesa, 2 = Receita.")]
    public TipoTransacaoEnum IdTipo { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "Categoria é obrigatória.")]
    public int IdCategoria { get; set; }
}
