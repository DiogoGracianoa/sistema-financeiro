using SistemaFinanceiro.Api.Models.DTOs.Requests;
using SistemaFinanceiro.Api.Models.DTOs.Responses;

namespace SistemaFinanceiro.Api.Services.Interfaces;

public interface ICategoriasService
{
    Task<List<CategoriaResponse>> ObterCategoriasAsync();
    Task<CategoriaResponse> CriarCategoriaAsync(CategoriaRequest categoria);
}
