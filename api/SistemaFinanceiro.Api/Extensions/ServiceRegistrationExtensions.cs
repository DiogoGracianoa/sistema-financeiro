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

        // Repositories
        services.AddScoped<IPessoasRepository, PessoasRepository>();

        return services;
    }
}
