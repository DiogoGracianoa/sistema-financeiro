namespace SistemaFinanceiro.Api.Models.Entities;

public class PessoaEntity
{
    public int Id { get; set; }
    public int Idade { get; set; }
    public string Nome { get; set; } = string.Empty;
    public bool Ativo { get; set; }
    public DateTime DataCriacao { get; set; }
}
