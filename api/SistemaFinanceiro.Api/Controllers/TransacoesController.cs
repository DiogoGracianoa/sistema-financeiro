using Microsoft.AspNetCore.Mvc;
using SistemaFinanceiro.Api.Models.DTOs.Requests;
using SistemaFinanceiro.Api.Models.DTOs.Responses;
using SistemaFinanceiro.Api.Services.Interfaces;
using System.Net.Mime;

namespace SistemaFinanceiro.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Produces(MediaTypeNames.Application.Json)]
[Tags("Transações")]
public class TransacoesController : ControllerBase
{
    private readonly ITransacoesService _transacoesService;

    public TransacoesController(ITransacoesService transacoesService)
    {
        _transacoesService = transacoesService;
    }

    /// <summary>
    /// Lista todas as transações ativas cadastradas.
    /// </summary>
    /// <returns>Lista de transações ativas.</returns>
    [HttpGet]
    [ProducesResponseType(typeof(BaseResponse<List<TransacaoResponse>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(BaseResponse<string>), StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<BaseResponse<List<TransacaoResponse>>>> ObterTodasTransacoes()
    {
        var transacoes = await _transacoesService.ObterTransacoesAsync();

        return Ok(new BaseResponse<List<TransacaoResponse>>
        {
            Sucesso = true,
            Mensagem = "Transações obtidas com sucesso.",
            Dados = transacoes
        });
    }

    /// <summary>
    /// Cria uma nova transação.
    /// </summary>
    /// <param name="transacaoRequest">Dados da transação para criação.</param>
    /// <remarks>
    /// Valores possíveis para <c>idTipo</c>:
    /// 1 - Despesa
    /// 2 - Receita
    /// </remarks>
    /// <returns>Transação criada.</returns>
    [HttpPost]
    [Consumes(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(BaseResponse<TransacaoCriadaResponse>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(BaseResponse<string>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(BaseResponse<string>), StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<BaseResponse<TransacaoCriadaResponse>>> CriarTransacao([FromBody] TransacaoRequest transacaoRequest)
    {
        var transacaoCriada = await _transacoesService.CriarTransacaoAsync(transacaoRequest);

        return StatusCode(201, new BaseResponse<TransacaoCriadaResponse>
        {
            Sucesso = true,
            Mensagem = "Transação criada com sucesso.",
            Dados = transacaoCriada
        });
    }
}
