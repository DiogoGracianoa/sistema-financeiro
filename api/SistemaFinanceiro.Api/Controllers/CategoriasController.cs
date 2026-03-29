using Microsoft.AspNetCore.Mvc;
using SistemaFinanceiro.Api.Models.DTOs.Requests;
using SistemaFinanceiro.Api.Models.DTOs.Responses;
using SistemaFinanceiro.Api.Services.Interfaces;
using System.Net.Mime;

namespace SistemaFinanceiro.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Produces(MediaTypeNames.Application.Json)]
[Tags("Categorias")]
public class CategoriasController : ControllerBase
{
    private readonly ICategoriasService _categoriasService;

    public CategoriasController(ICategoriasService categoriasService)
    {
        _categoriasService = categoriasService;
    }

    /// <summary>
    /// Lista todas as categorias cadastradas.
    /// </summary>
    /// <returns>Lista de categorias.</returns>
    [HttpGet]
    [ProducesResponseType(typeof(BaseResponse<List<CategoriaResponse>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<BaseResponse<List<CategoriaResponse>>>> ObterTodasCategorias()
    {
        var categorias = await _categoriasService.ObterCategoriasAsync();

        return Ok(new BaseResponse<List<CategoriaResponse>>
        {
            Sucesso = true,
            Mensagem = "Categorias obtidas com sucesso.",
            Dados = categorias
        });
    }

    /// <summary>
    /// Cria uma nova categoria.
    /// </summary>
    /// <param name="categoriaRequest">Dados da categoria para criação.</param>
    /// <remarks>
    /// Valores possíveis para <c>idFinalidade</c>:
    /// 1 - Despesa
    /// 2 - Receita
    /// 3 - Ambas
    /// </remarks>
    /// <returns>Categoria criada.</returns>
    [HttpPost]
    [Consumes(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(BaseResponse<CategoriaResponse>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(BaseResponse<string>), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<BaseResponse<CategoriaResponse>>> CriarCategoria([FromBody] CategoriaRequest categoriaRequest)
    {
        var categoriaCriada = await _categoriasService.CriarCategoriaAsync(categoriaRequest);

        return StatusCode(201, new BaseResponse<CategoriaResponse>
        {
            Sucesso = true,
            Mensagem = "Categoria criada com sucesso.",
            Dados = categoriaCriada
        });
    }
}
