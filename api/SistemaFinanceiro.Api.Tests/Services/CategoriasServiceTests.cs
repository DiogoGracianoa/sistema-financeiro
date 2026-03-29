using NSubstitute;
using SistemaFinanceiro.Api.Models.DTOs.Requests;
using SistemaFinanceiro.Api.Models.Entities;
using SistemaFinanceiro.Api.Models.Enums;
using SistemaFinanceiro.Api.Repositories.Interfaces;
using SistemaFinanceiro.Api.Services;

namespace SistemaFinanceiro.Api.Tests.Services;

public class CategoriasServiceTests
{
    private readonly ICategoriasRepository _categoriasRepository;
    private readonly CategoriasService _categoriasService;

    public CategoriasServiceTests()
    {
        _categoriasRepository = Substitute.For<ICategoriasRepository>();
        _categoriasService = new CategoriasService(_categoriasRepository);
    }

    [Fact]
    public async Task ObterCategoriasAsync_DeveRetornarListaMapeada()
    {
        _categoriasRepository.ObterTodasAsync().Returns(
        new List<CategoriaEntity>
        {
            new() { Id = 1, Descricao = "Alimentação", IdFinalidade = FinalidadeCategoriaEnum.Despesa, DataCriacao = new DateTime(2025, 1, 10) },
            new() { Id = 2, Descricao = "Salário", IdFinalidade = FinalidadeCategoriaEnum.Receita, DataCriacao = new DateTime(2025, 2, 11) }
        });

        var resultado = await _categoriasService.ObterCategoriasAsync();

        Assert.Equal(2, resultado.Count);
        Assert.Equal(1, resultado[0].Id);
        Assert.Equal("Alimentação", resultado[0].Descricao);
        Assert.Equal(FinalidadeCategoriaEnum.Despesa, resultado[0].IdFinalidade);
        Assert.Equal(new DateTime(2025, 1, 10), resultado[0].DataCriacao);

        await _categoriasRepository.Received(1).ObterTodasAsync();
    }

    [Fact]
    public async Task CriarCategoriaAsync_DeveEnviarDadosCorretosParaRepositorioERetornarResponse()
    {
        var retornoRepositorio = new CategoriaEntity
        {
            Id = 10,
            Descricao = "Investimentos",
            IdFinalidade = FinalidadeCategoriaEnum.Ambas,
            DataCriacao = new DateTime(2025, 3, 20)
        };

        _categoriasRepository.AdicionarAsync(Arg.Any<CategoriaEntity>()).Returns(retornoRepositorio);

        var request = new CategoriaRequest { Descricao = "Investimentos", IdFinalidade = FinalidadeCategoriaEnum.Ambas };

        var resultado = await _categoriasService.CriarCategoriaAsync(request);

        await _categoriasRepository.Received(1).AdicionarAsync(Arg.Is<CategoriaEntity>(c =>
            c.Descricao == "Investimentos" &&
            c.IdFinalidade == FinalidadeCategoriaEnum.Ambas &&
            c.DataCriacao != default));

        Assert.Equal(10, resultado.Id);
        Assert.Equal("Investimentos", resultado.Descricao);
        Assert.Equal(FinalidadeCategoriaEnum.Ambas, resultado.IdFinalidade);
        Assert.Equal(new DateTime(2025, 3, 20), resultado.DataCriacao);
    }
}
