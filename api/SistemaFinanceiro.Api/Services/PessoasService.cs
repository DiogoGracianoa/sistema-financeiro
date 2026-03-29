using SistemaFinanceiro.Api.Models.DTOs.Requests;
using SistemaFinanceiro.Api.Models.DTOs.Responses;
using SistemaFinanceiro.Api.Models.Entities;
using SistemaFinanceiro.Api.Repositories.Interfaces;
using SistemaFinanceiro.Api.Services.Interfaces;

namespace SistemaFinanceiro.Api.Services;
public class PessoasService : IPessoasService
{
    private readonly IPessoasRepository _pessoasRepository;
    private readonly ITransacoesRepository _transacoesRepository;

    public PessoasService(IPessoasRepository repository, ITransacoesRepository transacoesRepository)
    {
        _pessoasRepository = repository;
        _transacoesRepository = transacoesRepository;
    }

    public async Task<List<PessoaResponse>> ObterPessoasAsync()
    {
        var pessoas = await _pessoasRepository.ObterTodasAsync();

        var response = pessoas.Select(p => new PessoaResponse
        {
            Id = p.Id,
            Nome = p.Nome,
            Idade = p.Idade,
            DataCriacao = p.DataCriacao
        }).ToList();

        return response;
    }

    public async Task<PessoaResponse> CriarPessoaAsync(PessoaRequest pessoa)
    {
        var novaPessoa = new PessoaEntity
        {
            Nome = pessoa.Nome,
            Idade = pessoa.Idade,
            Ativo = true,
            DataCriacao = DateTime.Now
        };

        var pessoaCriada = await _pessoasRepository.AdicionarAsync(novaPessoa);

        var response = new PessoaResponse
        {
            Id = pessoaCriada.Id,
            Nome = pessoaCriada.Nome,
            Idade = pessoaCriada.Idade,
            DataCriacao = pessoaCriada.DataCriacao
        };

        return response;
    }

    public async Task<PessoaResponse> AtualizarPessoaAsync(int id, PessoaRequest pessoa)
    {
        var novaPessoa = new PessoaEntity
        {
            Nome = pessoa.Nome,
            Idade = pessoa.Idade,
            Ativo = true,
            DataCriacao = DateTime.UtcNow
        };

        var pessoaAtualizada = await _pessoasRepository.AtualizarAsync(id, novaPessoa);

        var response = new PessoaResponse
        {
            Id = pessoaAtualizada.Id,
            Nome = pessoaAtualizada.Nome,
            Idade = pessoaAtualizada.Idade,
            DataCriacao = pessoaAtualizada.DataCriacao
        };

        return response;
    }

    public async Task<bool> DeletarPessoaAsync(int id)
    {
        var resultado = await _pessoasRepository.DeletarAsync(id);

        if (resultado)
        {
            await _transacoesRepository.InativarPorPessoaIdAsync(id);
        }

        return resultado;
    }
}
