using NSubstitute;
using SistemaFinanceiro.Api.Models.DTOs.Requests;
using SistemaFinanceiro.Api.Models.Entities;
using SistemaFinanceiro.Api.Models.Enums;
using SistemaFinanceiro.Api.Repositories.Interfaces;
using SistemaFinanceiro.Api.Services;

namespace SistemaFinanceiro.Api.Tests.Services;

public class TransacoesServiceTests
{
    private readonly ITransacoesRepository _transacoesRepository;
    private readonly IPessoasRepository _pessoasRepository;
    private readonly ICategoriasRepository _categoriasRepository;
    private readonly TransacoesService _transacoesService;

    public TransacoesServiceTests()
    {
        _transacoesRepository = Substitute.For<ITransacoesRepository>();
        _pessoasRepository = Substitute.For<IPessoasRepository>();
        _categoriasRepository = Substitute.For<ICategoriasRepository>();

        _transacoesService = new TransacoesService(
            _transacoesRepository,
            _pessoasRepository,
            _categoriasRepository);
    }

    [Fact]
    public async Task ObterTransacoesAsync_DeveRetornarListaMapeada()
    {
        _transacoesRepository.ObterTodasAtivasAsync().Returns(new List<TransacaoEntity>
        {
            new() { Id = 1, Descricao = "Almoço", Valor = 35.50m, IdTipo = TipoTransacaoEnum.Despesa, IdCategoria = 10, DataCriacao = new DateTime(2025, 1, 10), Ativo = true },
            new() { Id = 2, Descricao = "Salário", Valor = 5000m, IdTipo = TipoTransacaoEnum.Receita, IdCategoria = 20, DataCriacao = new DateTime(2025, 1, 15), Ativo = true }
        });

        var resultado = await _transacoesService.ObterTransacoesAsync();

        Assert.Equal(2, resultado.Count);
        Assert.Equal(1, resultado[0].Id);
        Assert.Equal("Almoço", resultado[0].Descricao);
        Assert.Equal(35.50m, resultado[0].Valor);
        Assert.Equal(TipoTransacaoEnum.Despesa, resultado[0].IdTipo);
        Assert.Equal(10, resultado[0].IdCategoria);
        Assert.Equal(new DateTime(2025, 1, 10), resultado[0].DataCriacao);

        await _transacoesRepository.Received(1).ObterTodasAtivasAsync();
    }

    [Fact]
    public async Task CriarTransacaoAsync_DeveCriarTransacaoQuandoValida()
    {
        var request = new TransacaoRequest
        {
            IdPessoa = 1,
            Descricao = "Freela",
            Valor = 1200m,
            IdTipo = TipoTransacaoEnum.Receita,
            IdCategoria = 2
        };

        _pessoasRepository.ObterPorIdAsync(1).Returns(new PessoaEntity { Id = 1, Idade = 30, Nome = "Ana", Ativo = true, DataCriacao = new DateTime(2025, 1, 1) });
        _categoriasRepository.ObterPorIdAsync(2).Returns(new CategoriaEntity { Id = 2, Descricao = "Trabalho", IdFinalidade = FinalidadeCategoriaEnum.Receita, DataCriacao = new DateTime(2025, 1, 2) });

        _transacoesRepository.AdicionarAsync(Arg.Any<TransacaoEntity>()).Returns(new TransacaoEntity
        {
            Id = 99,
            IdPessoa = 1,
            Descricao = "Freela",
            Valor = 1200m,
            IdTipo = TipoTransacaoEnum.Receita,
            IdCategoria = 2,
            Ativo = true,
            DataCriacao = new DateTime(2025, 3, 20)
        });

        var resultado = await _transacoesService.CriarTransacaoAsync(request);

        await _transacoesRepository.Received(1).AdicionarAsync(Arg.Is<TransacaoEntity>(t =>
            t.IdPessoa == 1 &&
            t.Descricao == "Freela" &&
            t.Valor == 1200m &&
            t.IdTipo == TipoTransacaoEnum.Receita &&
            t.IdCategoria == 2 &&
            t.Ativo &&
            t.DataCriacao != default));

        Assert.Equal(99, resultado.Id);
        Assert.Equal(1, resultado.IdPessoa);
        Assert.Equal("Freela", resultado.Descricao);
        Assert.Equal(1200m, resultado.Valor);
        Assert.Equal(TipoTransacaoEnum.Receita, resultado.IdTipo);
        Assert.Equal(2, resultado.Categoria.Id);
        Assert.Equal(FinalidadeCategoriaEnum.Receita, resultado.Categoria.IdFinalidade);
        Assert.Equal(new DateTime(2025, 3, 20), resultado.DataCriacao);
    }

    [Fact]
    public async Task CriarTransacaoAsync_QuandoPessoaMenorEReceita_DeveLancarExcecao()
    {
        var request = new TransacaoRequest
        {
            IdPessoa = 1,
            Descricao = "Mesada",
            Valor = 100m,
            IdTipo = TipoTransacaoEnum.Receita,
            IdCategoria = 1
        };

        _pessoasRepository.ObterPorIdAsync(1).Returns(new PessoaEntity { Id = 1, Idade = 17, Nome = "João", Ativo = true });
        _categoriasRepository.ObterPorIdAsync(1).Returns(new CategoriaEntity { Id = 1, Descricao = "Geral", IdFinalidade = FinalidadeCategoriaEnum.Ambas });

        var ex = await Assert.ThrowsAsync<ArgumentException>(() => _transacoesService.CriarTransacaoAsync(request));

        Assert.Equal("Pessoa menor de 18 anos só pode realizar transações do tipo despesa.", ex.Message);
    }

    [Fact]
    public async Task CriarTransacaoAsync_QuandoReceitaComCategoriaDespesa_DeveLancarExcecao()
    {
        var request = new TransacaoRequest
        {
            IdPessoa = 1,
            Descricao = "Pagamento",
            Valor = 100m,
            IdTipo = TipoTransacaoEnum.Receita,
            IdCategoria = 1
        };

        _pessoasRepository.ObterPorIdAsync(1).Returns(new PessoaEntity { Id = 1, Idade = 30, Nome = "Maria", Ativo = true });
        _categoriasRepository.ObterPorIdAsync(1).Returns(new CategoriaEntity { Id = 1, Descricao = "Conta", IdFinalidade = FinalidadeCategoriaEnum.Despesa });

        var ex = await Assert.ThrowsAsync<ArgumentException>(() => _transacoesService.CriarTransacaoAsync(request));

        Assert.Equal("Transação do tipo receita não pode usar categoria com finalidade despesa.", ex.Message);
    }

    [Fact]
    public async Task CriarTransacaoAsync_QuandoDespesaComCategoriaReceita_DeveLancarExcecao()
    {
        var request = new TransacaoRequest
        {
            IdPessoa = 1,
            Descricao = "Conta de luz",
            Valor = 200m,
            IdTipo = TipoTransacaoEnum.Despesa,
            IdCategoria = 1
        };

        _pessoasRepository.ObterPorIdAsync(1).Returns(new PessoaEntity { Id = 1, Idade = 40, Nome = "Carlos", Ativo = true });
        _categoriasRepository.ObterPorIdAsync(1).Returns(new CategoriaEntity { Id = 1, Descricao = "Salário", IdFinalidade = FinalidadeCategoriaEnum.Receita });

        var ex = await Assert.ThrowsAsync<ArgumentException>(() => _transacoesService.CriarTransacaoAsync(request));

        Assert.Equal("Transação do tipo despesa não pode usar categoria com finalidade receita.", ex.Message);
    }
}
