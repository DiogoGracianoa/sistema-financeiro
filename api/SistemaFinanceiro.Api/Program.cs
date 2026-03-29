using Scalar.AspNetCore;
using SistemaFinanceiro.Api.Extensions;
using SistemaFinanceiro.Api.Middlewares;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AdicionarPoliticiaDeCors();

builder.AdicionarCultureBrasileira();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();
builder.Services.RegistrarDependencias(builder.Configuration);

var app = builder.Build();

app.UsarPoliticasDeCors();
app.UseMiddleware<ExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.MapControllers();

app.Run();
