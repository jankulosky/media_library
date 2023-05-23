using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Nebb.Nss._2022.Aws.Model.Entities;

namespace Nebb.Nss._2022.Aws.Service.Interfaces
{
    public interface IUploadService
    {
        Task<ActionResult<MediaFiles>> UploadFileAsync(IFormFile file);
    }
}
