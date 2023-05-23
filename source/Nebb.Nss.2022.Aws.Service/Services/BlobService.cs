using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.AspNetCore.Http;
using Nebb.Nss._2022.Aws.Service.Interfaces;

namespace Nebb.Nss._2022.Aws.Service.Services
{
    public class BlobService : IBlobService
    {
        private readonly BlobServiceClient _blobClient;

        public BlobService(BlobServiceClient blobClient)
        {
            _blobClient = blobClient;
        }

        public async Task<IEnumerable<string>> AllBlobs(string containerName)
        {
            var containerClient = _blobClient.GetBlobContainerClient(containerName);

            var files = new List<string>();

            var blobs = containerClient.GetBlobsAsync();

            await foreach (var item in blobs)
            {
                files.Add(item.Name);
            }

            return files;
        }

        public async Task<bool> DeleteBlob(string name, string containerName)
        {
            var containerClient = _blobClient.GetBlobContainerClient(containerName);
            var blobClient = containerClient.GetBlobClient(name);

            return await blobClient.DeleteIfExistsAsync();
        }

        public async Task<string> GetBlob(string name, string containerName)
        {
            var containerClient = _blobClient.GetBlobContainerClient(containerName);
            var blobClient = containerClient.GetBlobClient(name);

            return blobClient.Uri.AbsoluteUri;
        }

        public async Task<bool> UploadBlob(string name, IFormFile file, string containerName)
        {
            var containerClient = _blobClient.GetBlobContainerClient(containerName);
            var blobClient = containerClient.GetBlobClient(name);

            var httpHeaders = new BlobHttpHeaders()
            {
                ContentType = file.ContentType
            };

            var result = await blobClient.UploadAsync(file.OpenReadStream(), httpHeaders);

            if (result != null) return true;

            return false;
        }
    }
}
