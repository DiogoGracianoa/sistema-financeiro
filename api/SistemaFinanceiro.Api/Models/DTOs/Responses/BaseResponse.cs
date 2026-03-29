namespace SistemaFinanceiro.Api.Models.DTOs.Responses;

public class BaseResponse<T>
{
    public bool Sucesso { get; set; }
    public string Mensagem { get; set; } = string.Empty;
    public T? Dados { get; set; }
}
