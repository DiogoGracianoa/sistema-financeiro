using Npgsql;
using System.Data;

namespace SistemaFinanceiro.Api.Repositories.Base;

public class PgsqlBaseRepository
{
    protected readonly ILogger _logger;
    protected readonly IConfiguration _configuration;

    protected PgsqlBaseRepository(ILogger logger, IConfiguration configuration)
    {
        _logger = logger;
        _configuration = configuration;
    }

    protected IDbConnection Connection
    {
        get
        {
            try
            {
                var connectionString = _configuration.GetConnectionString("DefaultConnection");

                if (string.IsNullOrWhiteSpace(connectionString))
                {
                    throw new InvalidOperationException("Connection string está vazia");
                }

                var dbConnection = new NpgsqlConnection(connectionString);
                dbConnection.Open();
                return dbConnection;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao tentar conexão com o PostgreSQL: {0}", ex.Message);
                throw;
            }
        }
    }
}
