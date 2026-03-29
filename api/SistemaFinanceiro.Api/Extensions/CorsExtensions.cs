namespace SistemaFinanceiro.Api.Extensions;

public static class CorsExtensions
{
    private const string AllowFrontendPolicy = "AllowFrontend";

    public static IServiceCollection AdicionarPoliticiaDeCors(this IServiceCollection services)
    {
        services.AddCors(options =>
        {
            options.AddPolicy(AllowFrontendPolicy, policy =>
            {
                policy.WithOrigins("http://localhost:5173")
                      .AllowAnyHeader()
                      .AllowAnyMethod();
            });
        });

        return services;
    }

    public static IApplicationBuilder UsarPoliticasDeCors(this IApplicationBuilder app)
    {
        app.UseCors(AllowFrontendPolicy);
        return app;
    }
}


