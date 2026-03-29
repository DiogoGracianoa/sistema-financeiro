using System.Globalization;

namespace SistemaFinanceiro.Api.Extensions;

public static class CultureExtensions
{
    public static void AdicionarCultureBrasileira(this WebApplicationBuilder builder)
    {
        var culture = new CultureInfo("pt-BR");

        CultureInfo.DefaultThreadCurrentCulture = culture;
        CultureInfo.DefaultThreadCurrentUICulture = culture;
    }
}
