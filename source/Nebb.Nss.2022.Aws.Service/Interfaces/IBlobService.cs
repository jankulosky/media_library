using Microsoft.AspNetCore.Http;

namespace Nebb.Nss._2022.Aws.Service.Interfaces
{
    public interface IBlobService
    {
        Task<string> GetBlob(string name, string containerName);
        Task<IEnumerable<string>> AllBlobs(string containerName);
        Task<bool> UploadBlob(string name, IFormFile file, string containerName);
        Task<bool> DeleteBlob(string name, string containerName);
    }
}
