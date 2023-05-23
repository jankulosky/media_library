using Azure.Storage.Blobs;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Nebb.Nss._2022.Aws.Database.Container;
using Nebb.Nss._2022.Aws.Service.Helpers;
using Nebb.Nss._2022.Aws.Service.Interfaces;
using Nebb.Nss._2022.Aws.Service.Interfaces.Dummy;
using Nebb.Nss._2022.Aws.Service.Services;

namespace Nebb.Nss._2022.Aws.Service.Container
{
    public static class NebbAwsExtension
    {
        public static IServiceCollection AddServiceManagers(this IServiceCollection serviceCollection, IConfiguration configuration)
        {
            serviceCollection.AddDatabaseServiceManagers(configuration);
            serviceCollection.AddTransient<IDummyService, DummyService>();

            var blobConnection = configuration.GetValue<string>("BlobConnection");  

            serviceCollection.AddSingleton(x => new BlobServiceClient(blobConnection));
            serviceCollection.AddSingleton<IBlobService, BlobService>();
            serviceCollection.AddSingleton<IUploadService, UploadService>();
            serviceCollection.AddSingleton<ICosmosDbService>(InitializeCosmosDbClient.InitializeCosmosClientInstanceAsync(configuration.GetSection("CosmosDb")).GetAwaiter().GetResult());

            return serviceCollection;
        }
    }
}
