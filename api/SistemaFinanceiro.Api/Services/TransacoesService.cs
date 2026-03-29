using SistemaFinanceiro.Api.Models.DTOs.Requests;
using SistemaFinanceiro.Api.Models.DTOs.Responses;
using SistemaFinanceiro.Api.Models.Entities;
using SistemaFinanceiro.Api.Models.Enums;
using SistemaFinanceiro.Api.Repositories.Interfaces;
using SistemaFinanceiro.Api.Services.Interfaces;

namespace SistemaFinanceiro.Api.Services;

public class TransacoesService : ITransacoesService
{
    private readonly ITransacoesRepository _transacoesRepository;
    private readonly IPessoasRepository _pessoasRepository;
    private readonly ICategoriasRepository _categoriasRepository;

    public TransacoesService(
        ITransacoesRepository transacoesRepository,
        IPessoasRepository pessoasRepository,
        ICategoriasRepository categoriasRepository)
    {
        _transacoesRepository = transacoesRepository;
        _pessoasRepository = pessoasRepository;
        _categoriasRepository = categoriasRepository;
    }

    public async Task<List<TransacaoResponse>> ObterTransacoesAsync()
    {
        var transacoes = await _transacoesRepository.ObterTodasAtivasAsync();

        return transacoes.Select(t => new TransacaoResponse
        {
            Id = t.Id,
            Descricao = t.Descricao,
            Valor = t.Valor,
            IdTipo = t.IdTipo,
            IdCategoria = t.IdCategoria,
            DataCriacao = t.DataCriacao
        }).ToList();
    }

    public async Task<TransacaoCriadaResponse> CriarTransacaoAsync(TransacaoRequest transacao)
    {
        var pessoa = await _pessoasRepository.ObterPorIdAsync(transacao.IdPessoa);
        if (pessoa is null)
        {
            throw new ArgumentException($"Pessoa com id {transacao.IdPessoa} não encontrada.");
        }

        var categoria = await _categoriasRepository.ObterPorIdAsync(transacao.IdCategoria);
        if (categoria is null)
        {
            throw new ArgumentException($"Categoria com id {transacao.IdCategoria} não encontrada.");
        }

        if (pessoa.Idade < 18 && transacao.IdTipo != TipoTransacaoEnum.Despesa)
        {
            throw new ArgumentException($"Pessoa menor de 18 anos só pode realizar transações do tipo despesa. A pessoa informada (id {pessoa.Id}, idade {pessoa.Idade}) não atende a essa regra.");
        }

        if (transacao.IdTipo == TipoTransacaoEnum.Receita && categoria.IdFinalidade == FinalidadeCategoriaEnum.Despesa)
        {
            throw new ArgumentException($"Transação do tipo receita (id {(int)transacao.IdTipo}) não pode usar categoria com finalidade despesa (id {(int)categoria.IdFinalidade}). Categoria informada (id {categoria.Id}, finalidade {(int)categoria.IdFinalidade}) não atende a essa regra.");
        }

        if (transacao.IdTipo == TipoTransacaoEnum.Despesa && categoria.IdFinalidade == FinalidadeCategoriaEnum.Receita)
        {
            throw new ArgumentException($"Transação do tipo despesa (id {(int)transacao.IdTipo}) não pode usar categoria com finalidade receita (id {(int)categoria.IdFinalidade}). Categoria informada (id {categoria.Id}, finalidade {(int)categoria.IdFinalidade}) não atende a essa regra.");
        }

        var novaTransacao = new TransacaoEntity
        {
            IdPessoa = transacao.IdPessoa,
            Descricao = transacao.Descricao,
            Valor = transacao.Valor,
            IdTipo = transacao.IdTipo,
            IdCategoria = transacao.IdCategoria,
            Ativo = true,
            DataCriacao = DateTime.Now
        };

        var transacaoCriada = await _transacoesRepository.AdicionarAsync(novaTransacao);

        return new TransacaoCriadaResponse
        {
            Id = transacaoCriada.Id,
            IdPessoa = transacaoCriada.IdPessoa,
            Descricao = transacaoCriada.Descricao,
            Valor = transacaoCriada.Valor,
            IdTipo = transacaoCriada.IdTipo,
            Categoria = new TransacaoCategoriaResponse
            {
                Id = categoria.Id,
                IdFinalidade = categoria.IdFinalidade
            },
            DataCriacao = transacaoCriada.DataCriacao
        };
    }
}
