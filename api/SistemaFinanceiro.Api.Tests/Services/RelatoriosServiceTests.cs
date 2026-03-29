using NSubstitute;
using SistemaFinanceiro.Api.Models.Entities;
using SistemaFinanceiro.Api.Models.Enums;
using SistemaFinanceiro.Api.Repositories.Interfaces;
using SistemaFinanceiro.Api.Services;

namespace SistemaFinanceiro.Api.Tests.Services;

public class RelatoriosServiceTests
{
    private readonly ICategoriasRepository _categoriasRepository;
    private readonly IPessoasRepository _pessoasRepository;
    private readonly ITransacoesRepository _transacoesRepository;
    private readonly RelatoriosService _relatoriosService;

    public RelatoriosServiceTests()
    {
        _categoriasRepository = Substitute.For<ICategoriasRepository>();
        _pessoasRepository = Substitute.For<IPessoasRepository>();
        _transacoesRepository = Substitute.For<ITransacoesRepository>();
        _relatoriosService = new RelatoriosService(_categoriasRepository, _pessoasRepository, _transacoesRepository);
    }

    [Fact]
    public async Task ObterTotaisPorCategoriaAsync_DeveCalcularTotaisESaldoCorretamente()
    {
        _categoriasRepository.ObterTodasAsync().Returns(new List<CategoriaEntity>
        {
            new() { Id = 1, Descricao = "Salário", IdFinalidade = FinalidadeCategoriaEnum.Receita },
            new() { Id = 2, Descricao = "Moradia", IdFinalidade = FinalidadeCategoriaEnum.Despesa }
        });

        _transacoesRepository.ObterTodasAtivasAsync().Returns(new List<TransacaoEntity>
        {
            new() { IdCategoria = 1, IdTipo = TipoTransacaoEnum.Receita, Valor = 5000m, Ativo = true },
            new() { IdCategoria = 2, IdTipo = TipoTransacaoEnum.Despesa, Valor = 1200m, Ativo = true },
            new() { IdCategoria = 2, IdTipo = TipoTransacaoEnum.Despesa, Valor = 300m, Ativo = true }
        });

        var resultado = await _relatoriosService.ObterTotaisPorCategoriaAsync();

        Assert.Equal(2, resultado.Categorias.Count);
        Assert.Equal(1, resultado.Categorias[0].Id);
        Assert.Equal(5000m, resultado.Categorias[0].Receitas);
        Assert.Equal(0m, resultado.Categorias[0].Despesas);
        Assert.Equal(5000m, resultado.Categorias[0].Saldo);

        Assert.Equal(2, resultado.Categorias[1].Id);
        Assert.Equal(0m, resultado.Categorias[1].Receitas);
        Assert.Equal(1500m, resultado.Categorias[1].Despesas);
        Assert.Equal(-1500m, resultado.Categorias[1].Saldo);

        Assert.Equal(5000m, resultado.TotalGeral.Receitas);
        Assert.Equal(1500m, resultado.TotalGeral.Despesas);
        Assert.Equal(3500m, resultado.TotalGeral.Saldo);
    }

    [Fact]
    public async Task ObterTotaisPorPessoaAsync_DeveCalcularTotaisESaldoCorretamente()
    {
        _pessoasRepository.ObterTodasAsync().Returns(new List<PessoaEntity>
        {
            new() { Id = 1, Nome = "Ana", Ativo = true },
            new() { Id = 2, Nome = "Bruno", Ativo = true }
        });

        _transacoesRepository.ObterTodasAtivasAsync().Returns(new List<TransacaoEntity>
        {
            new() { IdPessoa = 1, IdTipo = TipoTransacaoEnum.Receita, Valor = 4000m, Ativo = true },
            new() { IdPessoa = 1, IdTipo = TipoTransacaoEnum.Despesa, Valor = 500m, Ativo = true },
            new() { IdPessoa = 2, IdTipo = TipoTransacaoEnum.Despesa, Valor = 1000m, Ativo = true },
            new() { IdPessoa = 999, IdTipo = TipoTransacaoEnum.Receita, Valor = 999m, Ativo = true }
        });

        var resultado = await _relatoriosService.ObterTotaisPorPessoaAsync();

        Assert.Equal(2, resultado.Pessoas.Count);
        Assert.Equal(1, resultado.Pessoas[0].Id);
        Assert.Equal("Ana", resultado.Pessoas[0].Nome);
        Assert.Equal(4000m, resultado.Pessoas[0].Receitas);
        Assert.Equal(500m, resultado.Pessoas[0].Despesas);
        Assert.Equal(3500m, resultado.Pessoas[0].Saldo);

        Assert.Equal(2, resultado.Pessoas[1].Id);
        Assert.Equal(0m, resultado.Pessoas[1].Receitas);
        Assert.Equal(1000m, resultado.Pessoas[1].Despesas);
        Assert.Equal(-1000m, resultado.Pessoas[1].Saldo);

        Assert.Equal(4000m, resultado.TotalGeral.Receitas);
        Assert.Equal(1500m, resultado.TotalGeral.Despesas);
        Assert.Equal(2500m, resultado.TotalGeral.Saldo);
    }
}
