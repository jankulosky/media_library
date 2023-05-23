using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Nebb.Nss._2022.Aws.Database.Dummy;
using Nebb.Nss._2022.Aws.Database.Interfaces.Dummy;

namespace Nebb.Nss._2022.Aws.Database.Container
{
    public static class NebbAwsDatabaseExtension
    {
        public static IServiceCollection AddDatabaseServiceManagers(this IServiceCollection serviceCollection, IConfiguration configuration)
        {
            serviceCollection.AddTransient<IDummyRepository, DummyRepository>();

            return serviceCollection;
        }
    }
}
