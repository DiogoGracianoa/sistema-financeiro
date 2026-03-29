using SistemaFinanceiro.Api.Repositories;
using SistemaFinanceiro.Api.Repositories.Interfaces;
using SistemaFinanceiro.Api.Services;
using SistemaFinanceiro.Api.Services.Interfaces;

namespace SistemaFinanceiro.Api.Extensions;

public static class ServiceRegistrationExtensions
{
    public static IServiceCollection RegistrarDependencias(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddSingleton(TimeProvider.System);

        // Services
        services.AddScoped<IPessoasService, PessoasService>();
        services.AddScoped<ICategoriasService, CategoriasService>();
        services.AddScoped<ITransacoesService, TransacoesService>();

        // Repositories
        services.AddScoped<IPessoasRepository, PessoasRepository>();
        services.AddScoped<ICategoriasRepository, CategoriasRepository>();
        services.AddScoped<ITransacoesRepository, TransacoesRepository>();

        return services;
    }
}
