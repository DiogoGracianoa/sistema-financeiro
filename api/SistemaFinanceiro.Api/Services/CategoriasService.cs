using SistemaFinanceiro.Api.Models.DTOs.Requests;
using SistemaFinanceiro.Api.Models.DTOs.Responses;
using SistemaFinanceiro.Api.Models.Entities;
using SistemaFinanceiro.Api.Repositories.Interfaces;
using SistemaFinanceiro.Api.Services.Interfaces;

namespace SistemaFinanceiro.Api.Services;

public class CategoriasService : ICategoriasService
{
    private readonly ICategoriasRepository _categoriasRepository;

    public CategoriasService(ICategoriasRepository categoriasRepository)
    {
        _categoriasRepository = categoriasRepository;
    }

    public async Task<List<CategoriaResponse>> ObterCategoriasAsync()
    {
        var categorias = await _categoriasRepository.ObterTodasAsync();

        return categorias.Select(c => new CategoriaResponse
        {
            Id = c.Id,
            Descricao = c.Descricao,
            IdFinalidade = c.IdFinalidade,
            DataCriacao = c.DataCriacao
        }).ToList();
    }

    public async Task<CategoriaResponse> CriarCategoriaAsync(CategoriaRequest categoria)
    {
        var novaCategoria = new CategoriaEntity
        {
            Descricao = categoria.Descricao,
            IdFinalidade = categoria.IdFinalidade,
            DataCriacao = DateTime.Now
        };

        var categoriaCriada = await _categoriasRepository.AdicionarAsync(novaCategoria);

        return new CategoriaResponse
        {
            Id = categoriaCriada.Id,
            Descricao = categoriaCriada.Descricao,
            IdFinalidade = categoriaCriada.IdFinalidade,
            DataCriacao = categoriaCriada.DataCriacao
        };
    }
}
