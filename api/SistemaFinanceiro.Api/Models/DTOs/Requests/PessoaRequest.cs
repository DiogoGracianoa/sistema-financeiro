using System.ComponentModel.DataAnnotations;

namespace SistemaFinanceiro.Api.Models.DTOs.Requests;

public class PessoaRequest
{
    [Required(ErrorMessage = "Nome é obrigatório.")]
    [StringLength(200, MinimumLength = 2, ErrorMessage = "Nome deve ter entre 2 e 200 caracteres.")]
    public string Nome { get; set; } = string.Empty;

    [Range(0, 150, ErrorMessage = "Idade deve estar entre 0 e 150.")]
    public int Idade { get; set; }
}
