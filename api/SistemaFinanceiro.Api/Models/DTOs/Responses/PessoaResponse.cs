namespace SistemaFinanceiro.Api.Models.DTOs.Responses;

public class PessoaResponse
{
    public int Id { get; set; }
    public int Idade { get; set; }
    public string Nome { get; set; } = string.Empty;
    public DateTime DataCriacao { get; set; }
}
