using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Nebb.Nss._2022.Aws.Model.Entities;
using Nebb.Nss._2022.Aws.Service.Helpers;
using Nebb.Nss._2022.Aws.Service.Interfaces;

namespace Nebb.Nss._2022.Aws.Service.Services
{
    public class UploadService : IUploadService
    {
        private readonly IBlobService _blobService;
        private readonly ICosmosDbService _cosmosDbService;

        public UploadService(IBlobService blobService, ICosmosDbService cosmosDbService)
        {
            _blobService = blobService;
            _cosmosDbService = cosmosDbService;
        }

        public async Task<ActionResult<MediaFiles>> UploadFileAsync(IFormFile file)
        {
            var id = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);

            var blobUploadResult = await _blobService.UploadBlob(id, file, "files");
            if (!blobUploadResult)
            {
                throw new Exception("Could not upload the file to Blob storage");
            }

            var fileUrl = await _blobService.GetBlob(id, "files");
            var thumbnail = await _blobService.GetBlob(id + ".jpg", "thumbnails");

            var mediaFile = new MediaFiles
            {
                Id = id,
                Name = file.FileName,
                Type = file.ContentType,
                Size = (int)file.Length,
                CreatedAt = DateTime.Now,
                LastModifiedAt = DateTime.Now,
                ThumbnailUrl = FileTypeThumbnailHelper.CheckFileType(file, fileUrl, thumbnail),
                FileUrl = fileUrl
            };

            await _cosmosDbService.AddAsync(mediaFile);

            return mediaFile;
        }
    }
}
