using Microsoft.AspNetCore.Mvc;
using SistemaFinanceiro.Api.Models.DTOs.Requests;
using SistemaFinanceiro.Api.Models.DTOs.Responses;
using SistemaFinanceiro.Api.Services.Interfaces;
using System.Net.Mime;

namespace SistemaFinanceiro.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Produces(MediaTypeNames.Application.Json)]
[Tags("Pessoas")]
public class PessoasController : ControllerBase
{
    private readonly IPessoasService _pessoasService;

    public PessoasController(IPessoasService service)
    {
        _pessoasService = service;
    }

    /// <summary>
    /// Lista todas as pessoas cadastradas.
    /// </summary>
    /// <returns>Lista de pessoas.</returns>
    [HttpGet]
    [ProducesResponseType(typeof(BaseResponse<List<PessoaResponse>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<BaseResponse<List<PessoaResponse>>>> ObterTodasPessoas()
    {
        var pessoas = await _pessoasService.ObterPessoasAsync();

        return Ok(new BaseResponse<List<PessoaResponse>>
        {
            Sucesso = true,
            Mensagem = "Pessoas obtidas com sucesso.",
            Dados = pessoas
        });
    }

    /// <summary>
    /// Cria uma nova pessoa.
    /// </summary>
    /// <param name="pessoaRequest">Dados da pessoa para criação.</param>
    /// <returns>Pessoa criada.</returns>
    [HttpPost]
    [Consumes(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(BaseResponse<PessoaResponse>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(BaseResponse<string>), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<BaseResponse<PessoaResponse>>> CriarPessoa([FromBody] PessoaRequest pessoaRequest)
    {
        var pessoaCriada = await _pessoasService.CriarPessoaAsync(pessoaRequest);

        return StatusCode(201, new BaseResponse<PessoaResponse>
        {
            Sucesso = true,
            Mensagem = "Pessoa criada com sucesso.",
            Dados = pessoaCriada
        });
    }

    /// <summary>
    /// Atualiza os dados de uma pessoa existente.
    /// </summary>
    /// <param name="id">Identificador da pessoa.</param>
    /// <param name="pessoaRequest">Dados para atualização.</param>
    /// <returns>Pessoa atualizada.</returns>
    [HttpPut("{id:int}")]
    [Consumes(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(BaseResponse<PessoaResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(BaseResponse<string>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<BaseResponse<PessoaResponse>>> AtualizarPessoa(int id, [FromBody] PessoaRequest pessoaRequest)
    {
        var pessoaAtualizada = await _pessoasService.AtualizarPessoaAsync(id, pessoaRequest);

        return Ok(new BaseResponse<PessoaResponse>
        {
            Sucesso = true,
            Mensagem = "Pessoa atualizada com sucesso.",
            Dados = pessoaAtualizada
        });
    }

    /// <summary>
    /// Remove logicamente uma pessoa pelo identificador.
    /// </summary>
    /// <param name="id">Identificador da pessoa.</param>
    /// <returns>Sem conteúdo quando removida com sucesso.</returns>
    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(BaseResponse<string>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult> DeletarPessoa(int id)
    {
        var sucesso = await _pessoasService.DeletarPessoaAsync(id);

        if (!sucesso)
        {
            return NotFound(new BaseResponse<string>
            {
                Sucesso = false,
                Mensagem = "Pessoa não encontrada."
            });
        }

        return NoContent();
    }
}
