using SistemaFinanceiro.Api.Models.DTOs.Responses;
using SistemaFinanceiro.Api.Models.Enums;
using SistemaFinanceiro.Api.Repositories.Interfaces;
using SistemaFinanceiro.Api.Services.Interfaces;

namespace SistemaFinanceiro.Api.Services;

public class RelatoriosService : IRelatoriosService
{
    private readonly ICategoriasRepository _categoriasRepository;
    private readonly IPessoasRepository _pessoasRepository;
    private readonly ITransacoesRepository _transacoesRepository;

    public RelatoriosService(
        ICategoriasRepository categoriasRepository,
        IPessoasRepository pessoasRepository,
        ITransacoesRepository transacoesRepository)
    {
        _categoriasRepository = categoriasRepository;
        _pessoasRepository = pessoasRepository;
        _transacoesRepository = transacoesRepository;
    }

    public async Task<RelatorioTotaisPorCategoriaResponse> ObterTotaisPorCategoriaAsync()
    {
        var categorias = await _categoriasRepository.ObterTodasAsync();
        var transacoesAtivas = await _transacoesRepository.ObterTodasAtivasAsync();

        var totaisPorCategoria = categorias
            .Select(categoria =>
            {
                var transacoesCategoria = transacoesAtivas.Where(t => t.IdCategoria == categoria.Id);
                var receitas = transacoesCategoria
                    .Where(t => t.IdTipo == TipoTransacaoEnum.Receita)
                    .Sum(t => t.Valor);
                var despesas = transacoesCategoria
                    .Where(t => t.IdTipo == TipoTransacaoEnum.Despesa)
                    .Sum(t => t.Valor);

                return new RelatorioTotaisPorCategoriaItemResponse
                {
                    Id = categoria.Id,
                    Descricao = categoria.Descricao,
                    IdFinalidade = categoria.IdFinalidade,
                    Receitas = receitas,
                    Despesas = despesas,
                    Saldo = receitas - despesas
                };
            })
            .OrderByDescending(item => item.Saldo)
            .ToList();

        return new RelatorioTotaisPorCategoriaResponse
        {
            Categorias = totaisPorCategoria,
            TotalGeral = new RelatorioTotalGeralResponse
            {
                Receitas = totaisPorCategoria.Sum(c => c.Receitas),
                Despesas = totaisPorCategoria.Sum(c => c.Despesas),
                Saldo = totaisPorCategoria.Sum(c => c.Saldo)
            }
        };
    }

    public async Task<RelatorioTotaisPorPessoaResponse> ObterTotaisPorPessoaAsync()
    {
        var pessoasAtivas = await _pessoasRepository.ObterTodasAsync();
        var transacoesAtivas = await _transacoesRepository.ObterTodasAtivasAsync();

        var pessoasAtivasIds = pessoasAtivas.Select(p => p.Id).ToHashSet();
        var transacoesPessoasAtivas = transacoesAtivas.Where(t => pessoasAtivasIds.Contains(t.IdPessoa));

        var totaisPorPessoa = pessoasAtivas
            .Select(pessoa =>
            {
                var transacoesPessoa = transacoesPessoasAtivas.Where(t => t.IdPessoa == pessoa.Id);
                var receitas = transacoesPessoa
                    .Where(t => t.IdTipo == TipoTransacaoEnum.Receita)
                    .Sum(t => t.Valor);
                var despesas = transacoesPessoa
                    .Where(t => t.IdTipo == TipoTransacaoEnum.Despesa)
                    .Sum(t => t.Valor);

                return new RelatorioTotaisPorPessoaItemResponse
                {
                    Id = pessoa.Id,
                    Nome = pessoa.Nome,
                    Receitas = receitas,
                    Despesas = despesas,
                    Saldo = receitas - despesas
                };
            })
            .OrderByDescending(item => item.Saldo)
            .ToList();

        return new RelatorioTotaisPorPessoaResponse
        {
            Pessoas = totaisPorPessoa,
            TotalGeral = new RelatorioTotalGeralResponse
            {
                Receitas = totaisPorPessoa.Sum(p => p.Receitas),
                Despesas = totaisPorPessoa.Sum(p => p.Despesas),
                Saldo = totaisPorPessoa.Sum(p => p.Saldo)
            }
        };
    }
}
