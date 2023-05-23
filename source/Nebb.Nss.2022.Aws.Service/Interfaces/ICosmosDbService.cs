using Nebb.Nss._2022.Aws.Model.Entities;
using Nebb.Nss._2022.Aws.Service.Helpers;

namespace Nebb.Nss._2022.Aws.Service.Interfaces
{
    public interface ICosmosDbService
    {
        Task<PagedList<MediaFiles>> GetMultipleAsync(QueryStringParameters queryParams, string queryString);
        Task<MediaFiles> GetAsync(string id);
        Task AddAsync(MediaFiles file);
        Task UpdateAsync(string id, MediaFiles file);
        Task DeleteAsync(string id);
        Task SoftDeleteAsync(string id);
        Task RestoreDeletedFilesAsync(string id);
    }
}
