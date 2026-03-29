using NSubstitute;
using SistemaFinanceiro.Api.Models.DTOs.Requests;
using SistemaFinanceiro.Api.Models.Entities;
using SistemaFinanceiro.Api.Repositories.Interfaces;
using SistemaFinanceiro.Api.Services;

namespace SistemaFinanceiro.Api.Tests.Services;

public class PessoasServiceTests
{
    private readonly IPessoasRepository _pessoasRepository;
    private readonly ITransacoesRepository _transacoesRepository;
    private readonly PessoasService _pessoasService;

    public PessoasServiceTests()
    {
        _pessoasRepository = Substitute.For<IPessoasRepository>();
        _transacoesRepository = Substitute.For<ITransacoesRepository>();
        _pessoasService = new PessoasService(_pessoasRepository, _transacoesRepository);
    }

    [Fact]
    public async Task ObterPessoasAsync_DeveRetornarListaMapeada()
    {
        _pessoasRepository.ObterTodasAsync().Returns(
        new List<PessoaEntity>
        {
            new PessoaEntity { Id = 1, Nome = "Ana", Idade = 25, DataCriacao = new DateTime(2025, 1, 10), Ativo = true },
            new PessoaEntity { Id = 2, Nome = "Bruno", Idade = 31, DataCriacao = new DateTime(2025, 2, 11), Ativo = true }
        });

        var resultado = await _pessoasService.ObterPessoasAsync();

        Assert.Equal(2, resultado.Count);
        Assert.Equal(1, resultado[0].Id);
        Assert.Equal("Ana", resultado[0].Nome);
        Assert.Equal(25, resultado[0].Idade);
        Assert.Equal(new DateTime(2025, 1, 10), resultado[0].DataCriacao);

        await _pessoasRepository.Received(1).ObterTodasAsync();
    }

    [Fact]
    public async Task CriarPessoaAsync_DeveEnviarDadosCorretosParaRepositorioERetornarResponse()
    {
        var retornoRepositorio = new PessoaEntity
        {
            Id = 10,
            Nome = "Carlos",
            Idade = 40,
            Ativo = true,
            DataCriacao = new DateTime(2025, 3, 20)
        };

        _pessoasRepository.AdicionarAsync(Arg.Any<PessoaEntity>()).Returns(retornoRepositorio);

        var request = new PessoaRequest { Nome = "Carlos", Idade = 40 };

        var resultado = await _pessoasService.CriarPessoaAsync(request);

        await _pessoasRepository.Received(1).AdicionarAsync(Arg.Is<PessoaEntity>(p =>
            p.Nome == "Carlos" &&
            p.Idade == 40 &&
            p.Ativo &&
            p.DataCriacao != default));

        Assert.Equal(10, resultado.Id);
        Assert.Equal("Carlos", resultado.Nome);
        Assert.Equal(40, resultado.Idade);
        Assert.Equal(new DateTime(2025, 3, 20), resultado.DataCriacao);
    }

    [Fact]
    public async Task AtualizarPessoaAsync_DevePassarIdERequestCorretamente()
    {
        var retornoRepositorio = new PessoaEntity
        {
            Id = 99,
            Nome = "Diana",
            Idade = 29,
            Ativo = true,
            DataCriacao = new DateTime(2025, 4, 15)
        };

        _pessoasRepository.AtualizarAsync(Arg.Any<int>(), Arg.Any<PessoaEntity>()).Returns(retornoRepositorio);

        var request = new PessoaRequest { Nome = "Diana", Idade = 29 };
        var resultado = await _pessoasService.AtualizarPessoaAsync(99, request);

        await _pessoasRepository.Received(1).AtualizarAsync(
            99,
            Arg.Is<PessoaEntity>(p => p.Nome == "Diana" && p.Idade == 29));

        Assert.Equal(99, resultado.Id);
        Assert.Equal("Diana", resultado.Nome);
        Assert.Equal(29, resultado.Idade);
        Assert.Equal(new DateTime(2025, 4, 15), resultado.DataCriacao);
    }

    [Fact]
    public async Task DeletarPessoaAsync_QuandoRepositorioRetornaTrue_DeveRetornarTrue()
    {
        _pessoasRepository.DeletarAsync(5).Returns(true);

        var resultado = await _pessoasService.DeletarPessoaAsync(5);

        Assert.True(resultado);
        await _pessoasRepository.Received(1).DeletarAsync(5);
        await _transacoesRepository.Received(1).InativarPorPessoaIdAsync(5);
    }

    [Fact]
    public async Task DeletarPessoaAsync_QuandoRepositorioRetornaFalse_DeveRetornarFalse()
    {
        _pessoasRepository.DeletarAsync(7).Returns(false);

        var resultado = await _pessoasService.DeletarPessoaAsync(7);

        Assert.False(resultado);
        await _pessoasRepository.Received(1).DeletarAsync(7);
        await _transacoesRepository.DidNotReceive().InativarPorPessoaIdAsync(Arg.Any<int>());
    }
}
