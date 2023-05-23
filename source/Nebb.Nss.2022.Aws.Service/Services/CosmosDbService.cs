using Microsoft.Azure.Cosmos;
using Nebb.Nss._2022.Aws.Model.Entities;
using Nebb.Nss._2022.Aws.Service.Helpers;
using Nebb.Nss._2022.Aws.Service.Interfaces;

namespace Nebb.Nss._2022.Aws.Service.Services
{
    public class CosmosDbService : ICosmosDbService
    {
        private Microsoft.Azure.Cosmos.Container _container;

        public CosmosDbService(CosmosClient cosmosDbClient, string databaseName, string containerName)
        {
            _container = cosmosDbClient.GetContainer(databaseName, containerName);
        }

        public async Task AddAsync(MediaFiles file)
        {
            await _container.CreateItemAsync(file);
        }

        public async Task DeleteAsync(string id)
        {
            await _container.DeleteItemAsync<MediaFiles>(id, PartitionKey.None);
        }
        public async Task SoftDeleteAsync(string id)
        {
            var file = await GetAsync(id);
            if (file == null)
            {
                return;
            }
            file.IsDeleted = true;
            await _container.UpsertItemAsync(file);
        }

        public async Task RestoreDeletedFilesAsync(string id)
        {
            var file = await GetAsync(id);
            if (file == null)
            {
                return;
            }
            file.IsDeleted = false;
            await _container.UpsertItemAsync(file);
        }

        public async Task<MediaFiles> GetAsync(string id)
        {
            try
            {
                var response = await _container.ReadItemAsync<MediaFiles>(id, PartitionKey.None);
                return response.Resource;
            }
            catch (CosmosException)
            {
                return null;
            }
        }

        public async Task<PagedList<MediaFiles>> GetMultipleAsync(QueryStringParameters queryParams, string queryString)
        {
            var queryStringWithFilter = queryParams.IsDeleted ? $"{queryString} where c.IsDeleted = true" : $"{queryString} where c.IsDeleted = false";

            if (!string.IsNullOrEmpty(queryParams.SearchBy))
            {
                queryStringWithFilter = !string.IsNullOrWhiteSpace(queryParams.SearchBy) ? queryStringWithFilter + $" AND CONTAINS(c.Name, '{queryParams.SearchBy}')" : queryStringWithFilter;
            }

            if (!string.IsNullOrEmpty(queryParams.FilterBy))
            {
                queryStringWithFilter = queryParams.FilterBy != "allFiles" ? queryStringWithFilter + $" AND CONTAINS(c.Type, '{queryParams.FilterBy}')" : queryStringWithFilter;
            }

            if (!string.IsNullOrEmpty(queryParams.OrderBy))
            {
                switch (queryParams.OrderBy)
                {
                    case "name":
                        queryStringWithFilter += $" ORDER BY c.Name {queryParams.SortOrder.ToUpper()}";
                        break;
                    case "date":
                        queryStringWithFilter += $" ORDER BY c.CreatedAt {queryParams.SortOrder.ToUpper()}";
                        break;
                    default:
                        break;
                }
            }

            var query = _container.GetItemQueryIterator<MediaFiles>(new QueryDefinition(queryStringWithFilter));

            var results = new List<MediaFiles>();
            while (query.HasMoreResults)
            {
                var response = await query.ReadNextAsync();
                results.AddRange(response.ToList());
            }

            var pagedList = PagedList<MediaFiles>.ToPagedList(results.AsQueryable(), queryParams.PageNumber, queryParams.PageSize);

            return pagedList;
        }

        public async Task UpdateAsync(string id, MediaFiles file)
        {
            await _container.UpsertItemAsync(file);
        }
    }
}
