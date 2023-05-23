using Microsoft.Extensions.Configuration;
using Nebb.Nss._2022.Aws.Service.Services;

namespace Nebb.Nss._2022.Aws.Service.Helpers
{
    public class InitializeCosmosDbClient
    {
        public static async Task<CosmosDbService> InitializeCosmosClientInstanceAsync(IConfigurationSection configurationSection)
        {
            var databaseName = configurationSection["DatabaseName"];
            var containerName = configurationSection["ContainerName"];
            var account = configurationSection["Account"];
            var key = configurationSection["Key"];

            var client = new Microsoft.Azure.Cosmos.CosmosClient(account, key);
            var database = await client.CreateDatabaseIfNotExistsAsync(databaseName);
            await database.Database.CreateContainerIfNotExistsAsync(containerName, "/partitionKey");

            var cosmosDbService = new CosmosDbService(client, databaseName, containerName);

            return cosmosDbService;
        }
    }
}
