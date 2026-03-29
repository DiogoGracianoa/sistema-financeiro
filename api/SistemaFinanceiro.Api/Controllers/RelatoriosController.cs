using Microsoft.AspNetCore.Mvc;
using SistemaFinanceiro.Api.Models.DTOs.Responses;
using SistemaFinanceiro.Api.Services.Interfaces;
using System.Net.Mime;

namespace SistemaFinanceiro.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Produces(MediaTypeNames.Application.Json)]
[Tags("Relatórios")]
public class RelatoriosController : ControllerBase
{
    private readonly IRelatoriosService _relatoriosService;

    public RelatoriosController(IRelatoriosService relatoriosService)
    {
        _relatoriosService = relatoriosService;
    }

    /// <summary>
    /// Lista os totais de receitas, despesas e saldo por categoria.
    /// </summary>
    [HttpGet("totais-por-categoria")]
    [ProducesResponseType(typeof(BaseResponse<RelatorioTotaisPorCategoriaResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(BaseResponse<string>), StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<BaseResponse<RelatorioTotaisPorCategoriaResponse>>> ObterTotaisPorCategoria()
    {
        var relatorio = await _relatoriosService.ObterTotaisPorCategoriaAsync();

        return Ok(new BaseResponse<RelatorioTotaisPorCategoriaResponse>
        {
            Sucesso = true,
            Mensagem = "Relatório por categoria obtido com sucesso.",
            Dados = relatorio
        });
    }

    /// <summary>
    /// Lista os totais de receitas, despesas e saldo por pessoa.
    /// </summary>
    [HttpGet("totais-por-pessoa")]
    [ProducesResponseType(typeof(BaseResponse<RelatorioTotaisPorPessoaResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(BaseResponse<string>), StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<BaseResponse<RelatorioTotaisPorPessoaResponse>>> ObterTotaisPorPessoa()
    {
        var relatorio = await _relatoriosService.ObterTotaisPorPessoaAsync();

        return Ok(new BaseResponse<RelatorioTotaisPorPessoaResponse>
        {
            Sucesso = true,
            Mensagem = "Relatório por pessoa obtido com sucesso.",
            Dados = relatorio
        });
    }
}
